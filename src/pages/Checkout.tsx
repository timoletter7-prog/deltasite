import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, User, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import { addRecentSupporter, addUserPurchase, getUserByUsername, clearUserPurchasesCache } from "@/lib/supabase";

// Supabase client configuratie
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user, login } = useUser();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    minecraftUsername: "",
    paymentMethod: "ideal",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Register all items in Supabase (both normal and backup tables)
      const purchasePromises = state.items.flatMap(item =>
        // Create one entry per quantity
        Array.from({ length: item.quantity }, () => [
          // Insert into normal purchases table
          supabase.from('purchases').insert([{
            server_id: 'deltamc_nl',
            player: formData.minecraftUsername,
            item: item.id,
            executed: false,
            payment: state.giftcard ? `giftcard id:${state.giftcard.code} Remaining:${Math.max(0, state.giftcard.remaining - state.total)}` : formData.paymentMethod
          }]),
          // Insert into backup_purchases table
          supabase.from('backup_purchases').insert([{
            server_id: 'deltamc_nl',
            player: formData.minecraftUsername,
            item: item.id,
            executed: false,
            payment: state.giftcard ? `giftcard id:${state.giftcard.code} Remaining:${Math.max(0, state.giftcard.remaining - state.total)}` : formData.paymentMethod
          }])
        ]).flat()
      );

      const results = await Promise.all(purchasePromises);

      // Check if all purchases were successful
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Failed to register some purchases');
      }

      // Handle giftcard deduction if applied
      if (state.giftcard) {
        // Check if this is an unlimited use giftcard first
        const { data: giftcardData } = await supabase
          .from('giftcard')
          .select('event, unlimited_use')
          .eq('code', state.giftcard.code)
          .single();

        if (giftcardData?.unlimited_use) {
          // Unlimited use giftcard - never delete automatically, keep it active
          // Don't update anything for unlimited use cards
        } else {
          const newRemaining = Math.max(0, state.giftcard.remaining - state.total);
          if (newRemaining === 0) {
            if (giftcardData?.event) {
              // Mark event giftcard as used instead of deleting
              await supabase
                .from('giftcard')
                .update({ remaining: 0, used: true })
                .eq('code', state.giftcard.code);
            } else {
              // Delete regular giftcard if no balance remaining
              await supabase
                .from('giftcard')
                .delete()
                .eq('code', state.giftcard.code);
            }
          } else {
            // Update remaining balance
            await supabase
              .from('giftcard')
              .update({ remaining: newRemaining })
              .eq('code', state.giftcard.code);
          }
        }
      }

      // Create or get user account
      await login(formData.minecraftUsername);

      // Get the user data after login
      const userData = await getUserByUsername(formData.minecraftUsername);
      if (!userData) {
        throw new Error('Kon geen gebruikersaccount aanmaken');
      }

      // Save purchases to user_purchases table
      const userPurchasePromises = state.items.flatMap(item =>
        Array.from({ length: item.quantity }, () =>
          addUserPurchase(userData.id, item.name, 'shop_item', item.price)
        )
      );

      await Promise.all(userPurchasePromises);

      // Add user to recent supporters for each item purchased
      const supporterPromises = state.items.flatMap(item =>
        Array.from({ length: item.quantity }, () =>
          addRecentSupporter(formData.minecraftUsername, item.name)
        )
      );

      await Promise.all(supporterPromises);

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Prepare products list for email
      const productsList = state.items.map(item =>
        `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      // Send order confirmation email via PHP endpoint
      try {
        // Try SMTP endpoint first (more reliable), fallback to basic PHP mail
        let emailResponse;
        let emailResult;

        try {
          // Try SMTP endpoint
          emailResponse = await fetch('https://deltamc.mydigibalance.nl/api/send-order-email-smtp.php', {

            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to_email: formData.email,
              to_name: formData.minecraftUsername,
              customer_name: formData.minecraftUsername,
              order_number: orderNumber,
              products: productsList,
              total_price: state.finalTotal.toFixed(2),
              payment_method: state.giftcard ? `Giftcard (${state.giftcard.code})` : formData.paymentMethod
            }),
          });

          if (emailResponse.ok) {
            const responseText = await emailResponse.text();
            // Try to parse as JSON, if it fails, treat as success
            try {
              emailResult = JSON.parse(responseText);
            } catch (parseError) {
              // If response is not JSON, check if it contains success indicators
              if (responseText.includes('success') || emailResponse.status === 200) {
                emailResult = { success: true, message: 'Email sent successfully' };
              } else {
                throw new Error('Invalid response format');
              }
            }
          } else {
            throw new Error(`HTTP ${emailResponse.status}`);
          }
        } catch (smtpError) {
          console.warn('SMTP email failed, trying PHP mail fallback:', smtpError);

          // Fallback to basic PHP mail endpoint
          emailResponse = await fetch('https://deltamc.mydigibalance.nl/api/send-order-email.php', {

            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to_email: formData.email,
              to_name: formData.minecraftUsername,
              customer_name: formData.minecraftUsername,
              order_number: orderNumber,
              products: productsList,
              total_price: state.finalTotal.toFixed(2),
              payment_method: state.giftcard ? `Giftcard (${state.giftcard.code})` : formData.paymentMethod
            }),
          });

          if (emailResponse.ok) {
            const responseText = await emailResponse.text();
            try {
              emailResult = JSON.parse(responseText);
            } catch (parseError) {
              if (responseText.includes('success') || emailResponse.status === 200) {
                emailResult = { success: true, message: 'Email sent successfully (fallback)' };
              } else {
                throw new Error('Invalid response format');
              }
            }
          } else {
            throw new Error(`HTTP ${emailResponse.status}`);
          }
        }

        if (!emailResult.success) {
          console.warn('Failed to send order confirmation email:', emailResult.error || emailResult.message);
        } else {
          console.log('Order confirmation email sent successfully');
        }
      } catch (emailError) {
        console.warn('Failed to send order confirmation email, but order was processed successfully:', emailError);
      }

      // Clear the user purchases cache so it gets refreshed on next check
      clearUserPurchasesCache(formData.minecraftUsername);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsCompleted(true);
      clearCart();
      toast({
        title: "Betaling geslaagd!",
        description: "Je aankoop is geregistreerd. Items worden binnen 5-10 minuten toegevoegd aan je Minecraft account.",
      });
    } catch (error) {
      console.error('Fout bij registratie aankoop:', error);
      toast({
        title: "Fout bij betaling",
        description: "Er ging iets mis bij het registreren van je aankoop. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-6">
              Je winkelwagen is leeg
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Voeg eerst items toe aan je winkelwagen voordat je gaat betalen.
            </p>
            <Button asChild size="lg">
              <Link to="/shop">Naar Shop</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-6">
                Bedankt voor je aankoop!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Je bestelling is succesvol verwerkt. Je items worden binnen 5-10 minuten toegevoegd aan je Minecraft account.
              </p>
              <div className="space-x-4">
                <Button asChild variant="outline">
                  <Link to="/shop">Verder Winkelen</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Terug naar Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/shop">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <h1 className="font-display text-4xl font-bold text-foreground">
                Checkout
              </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Besteloverzicht
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Aantal: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}

                      {state.giftcard && (
                        <div className="flex items-center justify-between text-green-600">
                          <div>
                            <h4 className="font-semibold">🎁 Giftcard ({state.giftcard.code})</h4>
                            <p className="text-sm text-green-600">
                              Giftcard tegoed toegepast
                            </p>
                            {state.giftcard.percentage_discount && state.giftcard.percentage_discount > 0 && (
                              <p className="text-sm text-green-600">
                                {state.giftcard.percentage_discount}% korting
                              </p>
                            )}
                          </div>
                          <span className="font-bold">
                            -€{(state.total - state.finalTotal).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <Separator />

                      {state.giftcard && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Subtotaal:</span>
                          <span>€{state.total.toFixed(2)}</span>
                        </div>
                      )}

                      {state.giftcard && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Giftcard korting:</span>
                          <span>-€{Math.min(state.giftcard.remaining, state.total).toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Totaal:</span>
                        <span>€{state.finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Betalingsgegevens
                    </CardTitle>
                    <CardDescription>
                      Vul je gegevens in om de betaling te voltooien.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mailadres</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="jouw@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minecraftUsername">Minecraft Gebruikersnaam</Label>
                        <Input
                          id="minecraftUsername"
                          name="minecraftUsername"
                          placeholder="Je Minecraft naam"
                          value={formData.minecraftUsername}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Betaalmethode</Label>
                        <select
                          id="paymentMethod"
                          name="paymentMethod"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                        >
                          <option value="ideal">iDEAL</option>
                          <option value="paypal">PayPal</option>
                          <option value="creditcard">Creditcard</option>
                        </select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Bezig met verwerken..." : `Betalen €${state.finalTotal.toFixed(2)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
