import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { redeemGiftcard } from '@/lib/supabase';

const GiftcardRedeem = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { applyGiftcard } = useCart();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "Fout",
        description: "Voer een giftcard code in",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await redeemGiftcard(code.trim());

      if (result.event) {
        // Event giftcard - redirect to event reward page
        navigate(`/event-reward?code=${encodeURIComponent(code.trim())}`);
        setCode('');
      } else {
        // Regular giftcard - apply to cart but stay on shop page
        applyGiftcard(result.giftcard.code, result.remaining, result.percentage_discount);
        toast({
          title: "Giftcard toegepast!",
          description: "Je korting is toegepast op je winkelwagen. Je kunt verder winkelen.",
        });
        setCode('');
      }
    } catch (error: any) {
      // Check if the error is about the giftcard being already used
      if (error.message && error.message.includes('al gebruikt')) {
        toast({
          title: "Giftcard Al Gebruikt",
          description: "Deze giftcard is al gebruikt en kan niet opnieuw worden verzilverd.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fout",
          description: error.message || "Er is iets misgegaan",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Giftcard Verzilveren</CardTitle>
          <CardDescription>
            Voer je giftcard code in om je tegoed te verzilveren
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Giftcard code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleRedeem}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Bezig..." : "Verzilveren"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftcardRedeem;
