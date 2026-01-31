import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { redeemGiftcard } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
  const { state, updateQuantity, removeItem, applyGiftcard, removeGiftcard } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [giftcardCode, setGiftcardCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleRedeem = async () => {
    if (!giftcardCode.trim()) return;

    setIsRedeeming(true);
    try {
      const result = await redeemGiftcard(giftcardCode.trim());

      // Check if this is an event giftcard - redirect to event reward page
      if (result.event) {
        navigate(`/event-reward?code=${encodeURIComponent(result.giftcard.code)}`);
        toast({
          title: "Event giftcard verzilverd!",
          description: "Je wordt doorgestuurd naar de event beloningen pagina.",
        });
      } else {
        // Normal giftcard - apply to cart
        applyGiftcard(result.giftcard.code, result.remaining, result.percentage_discount);
        toast({
          title: "Giftcard verzilverd!",
          description: result.message,
        });
        // Open the cart drawer to show the applied discount
        setIsOpen(true);
      }

      setGiftcardCode("");
    } catch (error) {
      toast({
        title: "Fout bij verzilveren",
        description: error instanceof Error ? error.message : "Er ging iets mis",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Winkelwagen ({itemCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Je winkelwagen is leeg
                </h3>
                <p className="text-muted-foreground mb-4">
                  Voeg items toe aan je winkelwagen om te beginnen met winkelen.
                </p>
                <Button onClick={() => setIsOpen(false)} asChild>
                  <Link to="/shop">Naar Shop</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg bg-card">
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-foreground">
                          {item.name}
                        </h4>
                        <p className="font-display text-primary font-bold">
                          €{item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-display w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}



                  {state.giftcard && (
                    <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-green-800">
                          Giftcard ({state.giftcard.code})
                        </h4>
                        <p className="text-sm text-green-600">
                          Giftcard tegoed toegepast
                        </p>
                        {state.giftcard.percentage_discount && state.giftcard.percentage_discount > 0 ? (
                          <p className="font-display text-green-700 font-bold">
                            {state.giftcard.percentage_discount}% korting
                          </p>
                        ) : state.giftcard.remaining > 0 ? (
                          <p className="font-display text-green-700 font-bold">
                            -€{Math.min(state.giftcard.remaining, state.total).toFixed(2)}
                          </p>
                        ) : (
                          <p className="font-display text-green-700 font-bold">
                            Giftcard actief
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-display w-8 text-center text-green-800">
                          1
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={removeGiftcard}
                          className="text-green-600 hover:text-green-700 border-green-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                {/* Compact Giftcard Redeem Section */}
                {!state.giftcard && (
                  <div className="mb-4 p-3 border rounded-lg bg-secondary/50 border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-medium text-white">Actiecode:</span>
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="ABC123-XYZ789"
                          value={giftcardCode}
                          onChange={(e) => setGiftcardCode(e.target.value.toUpperCase())}
                          className="flex-1 px-2 py-1 text-sm text-black placeholder-black border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleRedeem();
                            }
                          }}
                        />
                        <button
                          onClick={handleRedeem}
                          disabled={isRedeeming || !giftcardCode.trim()}
                          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 whitespace-nowrap"
                        >
                          {isRedeeming ? "..." : "Toevoegen"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {state.giftcard && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm text-muted-foreground">Subtotaal:</span>
                    <span className="font-display text-sm text-muted-foreground">
                      €{state.total.toFixed(2)}
                    </span>
                  </div>
                )}
                {state.giftcard && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm text-green-600">Giftcard korting:</span>
                    <span className="font-display text-sm text-green-600">
                      -€{(state.total - state.finalTotal).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-lg font-semibold">Totaal:</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    €{state.finalTotal.toFixed(2)}
                  </span>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>
                    Naar Checkout
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
