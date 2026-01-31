import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trophy, Sparkles, ArrowLeft, Shield, Crown, Diamond, Check, Star, Zap, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { redeemEventGiftcard, getUserPurchasedItems } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

// Hardcoded event reward options
const eventRewards = [
  {
    id: "event_winnaar_trail",
    name: "Event Winnaar Trail",
    icon: Sparkles,
    emoji: "👑",
    rarity: "Legendary",
    color: "from-yellow-400 to-orange-500",
    bgColor: "from-yellow-950/95 to-orange-950/95",
    borderColor: "border-yellow-400/60",
    shadowColor: "shadow-yellow-500/50",
    glowColor: "shadow-yellow-400/30",
    perks: [
      "Event winnaar trail",
      "Speciaal effect dat je achterlaat tijdens events",
      "Toont aan iedereen dat je een event hebt gewonnen",
    ],
  },
  {
    id: "prefix_winnaar",
    name: "Prefix [Winnaar]",
    icon: Crown,
    emoji: "👑",
    rarity: "Legendary",
    color: "from-purple-400 to-pink-500",
    bgColor: "from-purple-950/95 to-pink-950/95",
    borderColor: "border-purple-400/60",
    shadowColor: "shadow-purple-500/50",
    glowColor: "shadow-purple-400/30",
    perks: [
      "Prefix [Winnaar] in chat",
      "Speciaal prefix dat je status als event winnaar toont",
      "Altijd zichtbaar voor andere spelers",
    ],
  },
  {
    id: "gadget_winnaar",
    name: "Gadget Winnaar",
    icon: Zap,
    emoji: "👑",
    rarity: "Legendary",
    color: "from-red-400 to-pink-500",
    bgColor: "from-red-950/95 to-pink-950/95",
    borderColor: "border-red-400/60",
    shadowColor: "shadow-red-500/50",
    glowColor: "shadow-red-400/30",
    perks: [
      "Exclusief gadget voor event winnaars",
      "Speciaal item dat alleen winnaars kunnen gebruiken",
      "Unieke gameplay ervaring",
    ],
  },
];

const EventReward = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [availableRewards, setAvailableRewards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isGiftcardUsed, setIsGiftcardUsed] = useState(false);
  const [isCheckingGiftcard, setIsCheckingGiftcard] = useState(true);
  const [ownedRewards, setOwnedRewards] = useState<Set<string>>(new Set());

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      navigate('/shop');
      return;
    }

    loadAvailableRewards();
    checkOwnership();
  }, [code, user]);

  const checkOwnership = async () => {
    if (!user?.minecraft_username) {
      console.log('No user logged in, skipping ownership check');
      return;
    }

    console.log('Checking ownership for user:', user.minecraft_username);
    const owned = new Set<string>();
    try {
      // Get all purchased items from user_purchases table
      const purchasedItems = await getUserPurchasedItems(user.minecraft_username);
      console.log('User purchased items:', purchasedItems);

      // Check if any event rewards are in the purchased items
      purchasedItems.forEach((itemName: string) => {
        const reward = eventRewards.find(r => r.name === itemName);
        if (reward) {
          owned.add(reward.id);
        }
      });

      console.log('Final owned rewards:', owned);
      setOwnedRewards(owned);
    } catch (error) {
      console.error('Error checking reward ownership:', error);
    }
  };

  const loadAvailableRewards = () => {
    try {
      // Use hardcoded event rewards
      setAvailableRewards(eventRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      toast({
        title: "Fout",
        description: "Kon beloningen niet laden",
        variant: "destructive",
      });
      navigate('/shop');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewardSelection = (selectedItem: any) => {
    if (!code) return;

    // Navigate to checkout page with selected item
    navigate(`/event-reward-checkout?code=${encodeURIComponent(code)}&item=${encodeURIComponent(selectedItem.name)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Beloningen laden...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <Navbar />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-500 opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-green-400 rounded-full animate-ping delay-1000 opacity-40"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <section className="pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="flex justify-start mb-8">
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500 hover:to-purple-600 text-white border-purple-400/50 hover:border-purple-300/70 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Shop
              </Button>
            </div>

            {/* Enhanced Congratulatory Header */}
            <div className="text-center mb-20">
              <div className="relative inline-block">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-red-500/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse delay-500"></div>
                
                <div className="relative bg-gradient-to-br from-yellow-950/90 to-orange-950/90 backdrop-blur-xl rounded-3xl p-12 border border-yellow-400/40 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  {/* Floating sparkles */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-bounce">
                    <Sparkles className="w-full h-full" />
                  </div>
                  <div className="absolute -top-2 -right-6 w-6 h-6 text-orange-400 animate-ping">
                    <Star className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-4 -left-6 w-7 h-7 text-pink-400 animate-pulse">
                    <Zap className="w-full h-full" />
                  </div>
                  <div className="absolute -bottom-2 -right-4 w-5 h-5 text-purple-400 animate-bounce delay-300">
                    <Sparkles className="w-full h-full" />
                  </div>

                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-bounce">
                        <Trophy className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping opacity-30"></div>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-300 via-orange-400 via-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                      GEFELICITEERD!
                    </h1>
                    
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 animate-bounce delay-150">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-ping opacity-30 delay-150"></div>
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
                    Je hebt een event gewonnen! Kies hieronder je welverdiende beloning uit onze premium collectie.
                  </p>
                  
                  {/* Animated underline */}
                  <div className="mt-6 mx-auto w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Rewards Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {availableRewards.map((reward, index) => {
                const isOwned = ownedRewards.has(reward.id);
                const Icon = reward.icon;
                // Enhanced colors with better defaults
                const bgColor = reward.bgColor || "from-gray-900/95 to-gray-800/95";
                const borderColor = reward.borderColor || "border-gray-400/60";
                const shadowColor = reward.shadowColor || "shadow-gray-500/50";
                const glowColor = reward.glowColor || "shadow-gray-400/30";
                const iconColor = reward.color || "from-gray-400 to-gray-600";

                return (
                  <Card
                    key={reward.id}
                    className={`group relative overflow-hidden transition-all duration-700
                      ${isOwned ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-105 md:hover:scale-110 hover:-translate-y-2 md:hover:-translate-y-4"}
                      bg-gradient-to-br ${bgColor} backdrop-blur-xl border-2 ${borderColor} shadow-2xl ${shadowColor} h-full flex flex-col animate-fade-in-up w-full max-w-sm mx-auto`}
                    style={{ animationDelay: `${index * 200}ms` }}
                    onClick={() => {
                      if (!isOwned) handleRewardSelection(reward);
                    }}
                  >
                    {/* "In bezit" Badge */}
                    {isOwned && (
                      <div className="absolute top-4 left-4 z-20 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <Check className="w-4 h-4" />
                        In bezit
                      </div>
                    )}
                    {/* Enhanced Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${iconColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl`}></div>
                    <div className={`absolute inset-0 ${glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl`}></div>

                    {/* Floating particles on hover */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-100"></div>

                    <CardHeader className="text-center pb-6 relative z-10">
                      <div className={`relative w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-2xl ${glowColor} group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                        <Icon className="w-12 h-12 text-white" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                      </div>

                      <CardTitle className="text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg mb-2">
                        {reward.name}
                      </CardTitle>
                      
                      {reward.rarity && (
                        <div className="flex items-center justify-center gap-2">
                          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-gradient-to-r ${iconColor} text-white border border-white/20 shadow-lg`}>
                            {reward.rarity}
                          </span>
                          {reward.popular && (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black border border-yellow-300/50 shadow-lg animate-pulse">
                              POPULAIR
                            </span>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="px-8 relative z-10 flex-grow">
                      <div className="bg-black/30 rounded-2xl p-6 border border-white/10 h-full backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-lg text-gray-200 font-medium">Exclusieve Event Beloning</p>
                          <p className="text-sm text-gray-400 mt-2">Speciaal voor event winnaars</p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-8 pb-6 relative z-10">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOwned) handleRewardSelection(reward);
                        }}
                        disabled={isOwned || isRedeeming}
                        className={`w-full bg-gradient-to-r ${iconColor}
                          ${isOwned ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}
                          text-white font-bold py-8 text-xl shadow-2xl ${glowColor}
                          transition-all duration-300 border border-white/30`}
                      >
                        <span className="flex items-center justify-center gap-3">
                          {isOwned ? "Al in bezit" : isRedeeming ? "Bezig..." : "Kies deze prijs"}
                          {isOwned ? <Check className="w-6 h-6" /> : <Trophy className="w-6 h-6 animate-pulse" />}
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {availableRewards.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-2xl text-gray-500 font-light">Geen beloningen beschikbaar</p>
                <p className="text-gray-600 mt-2">Probeer het later opnieuw</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventReward;
