import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Sparkles, ArrowLeft, User, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { redeemEventGiftcard, addRecentSupporter, addUserPurchase, getUserByUsername, clearUserPurchasesCache } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/contexts/UserContext';

// Supabase client configuratie
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const EventRewardCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState({
    minecraftUsername: "",
    email: "",
  });

  const code = searchParams.get('code');
  const selectedItem = searchParams.get('item');

  useEffect(() => {
    if (!code || !selectedItem) {
      navigate('/shop');
      return;
    }
  }, [code, selectedItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.minecraftUsername.trim()) {
      toast({
        title: "Fout",
        description: "Voer je Minecraft gebruikersnaam in",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Fout",
        description: "Voer een geldig emailadres in",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create or get user account
      await login(formData.minecraftUsername);

      // Get the user data after login
      const userData = await getUserByUsername(formData.minecraftUsername);
      if (!userData) {
        throw new Error('Kon geen gebruikersaccount aanmaken');
      }

      // Save event reward to user_purchases table
      await addUserPurchase(userData.id, selectedItem!, 'event_reward', 0);

      // Register the event reward in purchases table (both normal and backup tables)
      const purchasePromises = [
        // Insert into normal purchases table
        supabase.from('purchases').insert([{
          server_id: 'deltamc_nl',
          player: formData.minecraftUsername,
          item: selectedItem,
          executed: false,
          payment: `event giftcard:${code}`
        }]),
        // Insert into backup_purchases table
        supabase.from('backup_purchases').insert([{
          server_id: 'deltamc_nl',
          player: formData.minecraftUsername,
          item: selectedItem,
          executed: false,
          payment: `event giftcard:${code}`
        }])
      ];

      const results = await Promise.all(purchasePromises);

      // Check if purchases were registered successfully
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Failed to register purchase');
      }

      // Add user to recent supporters
      await addRecentSupporter(formData.minecraftUsername, selectedItem!);

      // Clear the user purchases cache so it gets refreshed on next check
      clearUserPurchasesCache(formData.minecraftUsername);

      const result = await redeemEventGiftcard(code!, selectedItem!);

      // Send confirmation email
      try {
        const emailResponse = await fetch('/send-order-email.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to_email: formData.email,
            to_name: formData.minecraftUsername,
            customer_name: formData.minecraftUsername,
            order_number: `EVENT-${code}`,
            products: selectedItem,
            total_price: '0.00',
            payment_method: 'Event Giftcard'
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }

      setIsCompleted(true);
      toast({
        title: "Gefeliciteerd!",
        description: result.message,
      });

      // Redirect back to shop after successful redemption
      setTimeout(() => {
        navigate('/shop');
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Kon beloning niet verzilveren",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-3xl p-12 border border-green-200/50 shadow-2xl">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-bounce">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
                    BELONING VERZILVERD!
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-700 max-w-xl mx-auto leading-relaxed mb-8">
                    Je hebt succesvol <strong>{selectedItem}</strong> ontvangen! Je wordt automatisch doorgestuurd naar de shop.
                  </p>

                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <div className="flex justify-start mb-8">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-purple-500/50 hover:border-purple-400/70 shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
            </div>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-sm rounded-3xl p-8 border border-yellow-200/50 shadow-2xl">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 animate-bounce">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
                      {selectedItem}
                    </h1>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 animate-bounce delay-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                    Vul je Minecraft gebruikersnaam en emailadres in om je beloning te ontvangen.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <Card className="shadow-2xl border-2 border-purple-200/50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <User className="w-6 h-6" />
                  Gegevens Invoeren
                </CardTitle>
                <CardDescription>
                  Voer je Minecraft gebruikersnaam en emailadres in om je event beloning te ontvangen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="minecraftUsername" className="text-lg font-semibold">
                      Minecraft Gebruikersnaam
                    </Label>
                    <Input
                      id="minecraftUsername"
                      name="minecraftUsername"
                      placeholder="Je Minecraft naam"
                      value={formData.minecraftUsername}
                      onChange={handleInputChange}
                      required
                      className="text-lg py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-lg font-semibold">
                      Emailadres
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jouw@email.nl"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-lg py-3"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Bezig met verzilveren...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Beloning Ontvangen
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventRewardCheckout;
