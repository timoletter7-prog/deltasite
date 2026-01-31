
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecentSupporters from "@/components/RecentSupporters";
import GiftcardRedeem from "@/components/GiftcardRedeem";
import { ShoppingCart, Crown, Key, Star, Zap, Check, Flame, Zap as Lightning, Eye, Gift, Shield, Sparkles, Trophy, Diamond, X, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { addRecentSupporter, getUserPurchasedItems } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  rankPackages,
  particleTrails,
  gadgets,
  trails,
  nametagGadgets,
  nametagPrefixes,
  lobbyKeys,
  skyblockKeys
} from "@/data/shopItems";
 
const Shop = () => {
  const { addItem, applyGiftcard, state } = useCart();
  const { user } = useUser();
  const [currentView, setCurrentView] = useState("home");
  const [activeTab, setActiveTab] = useState("ranks");
  const [giftcardCode, setGiftcardCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Check if there's an active discount
  const hasDiscount = state.giftcard && (state.giftcard.remaining > 0 || (state.giftcard.percentage_discount && state.giftcard.percentage_discount > 0));

  // Check owned items when user changes or component mounts
  useEffect(() => {
    const checkOwnership = async () => {
      const owned = new Set<string>();

      // Check guest purchases from localStorage
      const guestPurchases = JSON.parse(localStorage.getItem('guestPurchases') || '[]');
      guestPurchases.forEach((purchase: any) => {
        owned.add(purchase.item_id || purchase.id);
      });

      // If user is logged in, get their purchased items from database
      if (user?.minecraft_username) {
        try {
          const purchasedItems = await getUserPurchasedItems(user.minecraft_username);
          purchasedItems.forEach((itemName: string) => {
            // Find the item ID by name in all shop categories
            const allItems = [
              ...rankPackages,
              ...particleTrails,
              ...trails,
              ...gadgets,
              ...nametagGadgets,
              ...nametagPrefixes,
              ...lobbyKeys,
              ...skyblockKeys
            ];
            const item = allItems.find(item => item.name === itemName);
            if (item) {
              owned.add(item.id);
            }
          });
        } catch (error) {
          console.error('Error checking user item ownership:', error);
        }
      }

      setOwnedItems(owned);
    };

    checkOwnership();
  }, [user]);
 
   const handlePurchase = (item: { id: string; name: string; price: number; description?: string }) => {
     // Add to cart   recent supporter addition happens in Checkout.tsx after payment
     addItem(item);
   };
 
   const handleInfo = (item: any) => {
     setSelectedItem(item);
     setInfoDialogOpen(true);
   };
 
 
 
   const renderContent = () => {
     if (currentView === "home") {
       return (
         <div className="space-y-16">
           {/* Hero Section */}
           <div className="text-center">
             <div className="relative">
               {/* Enhanced Background Effects */}
               <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 via-blue-950/20 to-purple-950/20 rounded-3xl blur-3xl animate-pulse"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-pink-950/10 via-transparent to-cyan-950/10 rounded-3xl blur-2xl animate-pulse delay-1000"></div>
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/5 via-transparent to-green-950/5 rounded-3xl blur-xl animate-pulse delay-2000"></div>
 
               {/* Animated Border */}
               <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-20 animate-gradient-x"></div>
 
               <div className="relative bg-gradient-to-br from-purple-950/90 via-blue-950/80 to-purple-950/90 backdrop-blur-sm rounded-3xl p-12 border border-purple-800/50 shadow-2xl hover:shadow-purple-500/20 transition-shadow duration-500">

                 {/* Enhanced Floating Elements */}
                 <div className="absolute top-8 left-8 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-bounce"></div>
                 <div className="absolute top-12 right-12 w-3 h-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-40 animate-bounce delay-300"></div>
                 <div className="absolute bottom-8 left-16 w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-50 animate-bounce delay-600"></div>
                 <div className="absolute bottom-12 right-8 w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-30 animate-bounce delay-900"></div>

                 {/* Additional Floating Elements */}
                 <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-gradient-to-br from-green-400 to-teal-400 rounded-full opacity-25 animate-float delay-1000"></div>
                 <div className="absolute top-3/4 left-1/2 w-3 h-3 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-30 animate-float delay-500"></div>
 
                 {/* Main Content */}
                 <div className="relative z-10">
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-spin-slow hover:animate-pulse">
                       <div className="text-2xl sm:text-4xl animate-bounce">🎁</div>
                     </div>
                     <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse text-center">
                       UNLOCK EXCLUSIVE LOOT
                     </h2>
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 animate-spin-slow hover:animate-pulse delay-300">
                       <div className="text-2xl sm:text-4xl animate-bounce delay-300">💎</div>
                     </div>
                   </div>

                   <p className="text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in-up px-4">
                     Ontdek de meest exclusieve items van DeltaMC! Van krachtige ranks tot zeldzame keys en unieke cosmetics.
                     <span className="text-purple-400 font-semibold animate-pulse"> Kies je categorie</span> en begin met het verzamelen van je collectie!
                   </p>

                   {/* Limited Deal Discount Code Section */}
                   <div className="animate-fade-in-up delay-1000 mb-8">
                     <div className="bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30 shadow-xl">
                       <div className="text-center">
                         <div className="flex items-center justify-center gap-3 mb-3">
                           <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                             <span className="text-lg">🎁</span>
                           </div>
                           <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                             LIMITED DEAL
                           </h3>
                           <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce delay-300">
                             <span className="text-lg">💎</span>
                           </div>
                         </div>
                         <p className="text-white text-lg mb-4">
                           Gebruik code <span className="font-black text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">DELTA20</span> voor
                         </p>
                         <div className="text-4xl font-black text-yellow-400 animate-pulse">
                           20% KORTING
                         </div>
                         <p className="text-white/80 text-sm mt-2">
                           Op je volledige bestelling • Ongelimiteerd gebruik
                         </p>
                       </div>
                     </div>
                   </div>

                   {/* Enhanced Stats with Animations */}
                   <div className="flex justify-center gap-4 sm:gap-8 mb-12 flex-wrap">
                     <div className="text-center animate-fade-in-up delay-300">
                       <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400 animate-count-up">100+</div>
                       <div className="text-xs sm:text-sm text-white">Unieke Items</div>
                       <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-2 animate-pulse"></div>
                     </div>
                     <div className="text-center animate-fade-in-up delay-600">
                       <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400 animate-count-up">24/7</div>
                       <div className="text-xs sm:text-sm text-muted-foreground">Beschikbaar</div>
                       <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2 animate-pulse delay-300"></div>
                     </div>
                     <div className="text-center animate-fade-in-up delay-900">
                       <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 animate-count-up">Premium</div>
                       <div className="text-xs sm:text-sm text-white">Kwaliteit</div>
                       <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mt-2 animate-pulse delay-600"></div>
                     </div>
                   </div>

                   {/* Call to Action Button */}
                   <div className="animate-fade-in-up delay-1200">
                     <button
                       className="px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
                       onClick={() => document.getElementById('shop-categories')?.scrollIntoView({ behavior: 'smooth' })}
                     >
                       <span className="flex items-center gap-2">
                         <span>Ontdek de Shop</span>
                         <span className="animate-bounce">↓</span>
                       </span>
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
 
           {/* Category Selection */}
           <div id="shop-categories" className="relative">
             {/* Background decorative elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
               <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-float delay-500"></div>
             </div>

             <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl px-4">
               Kies je Categorie
             </h3>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 relative z-10 px-4">
               {/* Ranks Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 backdrop-blur-sm border-2 border-purple-200/50 hover:border-purple-300/70 shadow-xl hover:shadow-purple-500/20 cursor-pointer p-4 sm:p-6"
                     onClick={() => setCurrentView("ranks")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-3 sm:pb-4 relative z-10">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                   </div>
                   <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                     Ranks
                   </CardTitle>
                   <CardDescription className="text-sm sm:text-base text-purple-800 group-hover:text-purple-700 transition-colors">
                     Word lid van de elite met exclusieve perks
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-xl sm:text-2xl font-bold text-purple-400 mb-3 sm:mb-4">Vanaf €4.99</div>
                   <div className="flex justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-purple-300 flex-wrap">
                     <Badge className="bg-purple-600/50 text-purple-200">Prefix</Badge>
                     <Badge className="bg-purple-600/50 text-purple-200">Perks</Badge>
                     <Badge className="bg-purple-600/50 text-purple-200">Keys</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-4 sm:pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 sm:py-3 text-sm sm:text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-105">
                     <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                     Bekijk Ranks
                     <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
 
               {/* Keys Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm border-2 border-blue-200/50 hover:border-blue-300/70 shadow-xl hover:shadow-blue-500/20 cursor-pointer"
                     onClick={() => setCurrentView("keys")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-4 relative z-10">
                   <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <Key className="w-10 h-10 text-white" />
                   </div>
                   <CardTitle className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                     Keys
                   </CardTitle>
                   <CardDescription className="text-blue-800 group-hover:text-blue-700 transition-colors">
                     Open exclusieve crates met zeldzame loot
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-2xl font-bold text-blue-400 mb-4">Vanaf €1.99</div>
                   <div className="flex justify-center gap-2 text-sm text-blue-300">
                     <Badge className="bg-blue-600/50 text-blue-200">Lobby</Badge>
                     <Badge className="bg-blue-600/50 text-blue-200">Skyblock</Badge>
                     <Badge className="bg-blue-600/50 text-blue-200">Rare</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
                     <Key className="w-5 h-5 mr-2" />
                     Bekijk Keys
                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
 
               {/* Trails Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-green-950/80 to-emerald-950/80 backdrop-blur-sm border-2 border-green-700/50 hover:border-green-500/70 shadow-xl hover:shadow-green-500/20 cursor-pointer"
                     onClick={() => setCurrentView("particles")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-4 relative z-10">
                   <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <Flame className="w-10 h-10 text-white" />
                   </div>
                   <CardTitle className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl text-shadow-lg">
                     Trails
                   </CardTitle>
                   <CardDescription className="text-green-50 group-hover:text-white transition-colors drop-shadow-xl text-lg font-semibold">
                     Laat een spoor van magie achter je
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-2xl font-bold text-green-400 mb-4">Vanaf €2.99</div>
                   <div className="flex justify-center gap-2 text-sm text-green-300">
                     <Badge className="bg-green-600/50 text-green-200">Particles</Badge>
                     <Badge className="bg-green-600/50 text-green-200">Effects</Badge>
                     <Badge className="bg-green-600/50 text-green-200">Style</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-105">
                     <Flame className="w-5 h-5 mr-2" />
                     Bekijk Trails
                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
 
               {/* Gadgets Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur-sm border-2 border-orange-200/50 hover:border-orange-300/70 shadow-xl hover:shadow-orange-500/20 cursor-pointer"
                     onClick={() => setCurrentView("gadgets")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-4 relative z-10">
                   <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <Zap className="w-10 h-10 text-white" />
                   </div>
                   <CardTitle className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                     Gadgets
                   </CardTitle>
                   <CardDescription className="text-orange-800 group-hover:text-orange-700 transition-colors">
                     Revolutionaire tools voor je avontuur
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-2xl font-bold text-orange-400 mb-4">Vanaf €2.99</div>
                   <div className="flex justify-center gap-2 text-sm text-orange-300">
                     <Badge className="bg-orange-600/50 text-orange-200">Tools</Badge>
                     <Badge className="bg-orange-600/50 text-orange-200">Weapons</Badge>
                     <Badge className="bg-orange-600/50 text-orange-200">Fun</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
                     <Zap className="w-5 h-5 mr-2" />
                     Bekijk Gadgets
                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
 
               {/* Nametags Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-pink-100 backdrop-blur-sm border-2 border-pink-200/50 hover:border-pink-300/70 shadow-xl hover:shadow-pink-500/20 cursor-pointer"
                     onClick={() => setCurrentView("nametags")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-4 relative z-10">
                   <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-pink-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <Star className="w-10 h-10 text-white" />
                   </div>
                   <CardTitle className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                     Nametags
                   </CardTitle>
                   <CardDescription className="text-pink-800 group-hover:text-pink-700 transition-colors">
                     Laat je naam stralen met unieke prefixes
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-2xl font-bold text-pink-400 mb-4">Vanaf €0.99</div>
                   <div className="flex justify-center gap-2 text-sm text-pink-300">
                     <Badge className="bg-pink-600/50 text-pink-200">Prefix</Badge>
                     <Badge className="bg-pink-600/50 text-pink-200">Style</Badge>
                     <Badge className="bg-pink-600/50 text-pink-200">Unique</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group-hover:scale-105">
                     <Star className="w-5 h-5 mr-2" />
                     Bekijk Nametags
                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
 
               {/* Donate Category */}
               <Card className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-yellow-50 to-amber-100 backdrop-blur-sm border-2 border-yellow-200/50 hover:border-yellow-300/70 shadow-xl hover:shadow-yellow-500/20 cursor-pointer"
                     onClick={() => setCurrentView("donate")}>
                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <CardHeader className="text-center pb-4 relative z-10">
                   <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-yellow-500/50 group-hover:rotate-12 transition-transform duration-500">
                     <div className="text-4xl">💰</div>
                   </div>
                   <CardTitle className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                     Doneer
                   </CardTitle>
                   <CardDescription className="text-yellow-800 group-hover:text-yellow-700 transition-colors">
                     Steun DeltaMC met een donatie
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center relative z-10">
                   <div className="text-2xl font-bold text-yellow-400 mb-4">Vanaf €1</div>
                   <div className="flex justify-center gap-2 text-sm text-yellow-300">
                     <Badge className="bg-yellow-600/50 text-yellow-200">Support</Badge>
                     <Badge className="bg-yellow-600/50 text-yellow-200">Community</Badge>
                     <Badge className="bg-yellow-600/50 text-yellow-200">Thanks</Badge>
                   </div>
                 </CardContent>
                 <CardFooter className="pt-6 relative z-10">
                   <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold py-3 text-lg shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 group-hover:scale-105">
                     <div className="text-2xl mr-2">💰</div>
                     Bekijk Donaties
                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                   </Button>
                 </CardFooter>
               </Card>
             </div>
           </div>
         </div>
       );
     }
 
     // Category views with back button
     switch (currentView) {
       case "ranks":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white border-purple-500/50 hover:border-purple-400/70 shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>
 
             {/* Ranks Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 to-blue-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-purple-950/80 to-blue-950/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                     <Crown className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                     Rank Packages
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                     <Sparkles className="w-6 h-6 text-white" />
                   </div>
                 </div>
 
           {/* RANKS Comparison Table */}
           <div className="space-y-8">
             {/* RANKS Header */}
             <div className="text-center">
               <h3 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
                 RANKS VERGELIJKING
               </h3>
             </div>

             {/* Desktop Table - Hidden on Mobile */}
             <div className="hidden lg:block overflow-x-auto">
               <table className="w-full border-collapse bg-gradient-to-br from-purple-950/80 to-blue-950/80 backdrop-blur-sm rounded-2xl border border-purple-800/50">
                 <thead>
                   <tr className="border-b border-purple-800/50">
                     <th className="text-left py-6 px-6 text-purple-300 font-bold text-lg">Functie</th>
                           {rankPackages.map((rank) => {
                             const Icon = rank.icon;
                             return (
                               <th key={rank.id} className="text-center py-6 px-4 min-w-[200px]">
                                 <div className={`relative bg-gradient-to-br ${rank.bgColor} backdrop-blur-sm rounded-xl p-4 border-2 ${rank.borderColor} shadow-xl ${rank.shadowColor} hover:shadow-2xl hover:shadow-current/40 transition-all duration-300 hover:scale-105`}>

                                   {/* Icon */}
                                   <div className="text-center mb-3">
                                     <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center shadow-lg shadow-current/30`}>
                                       <Icon className="w-6 h-6 text-white" />
                                     </div>
                                   </div>

                                   {/* Rank Name */}
                                   <div className="text-center mb-2">
                                     <h4 className="text-lg font-bold text-foreground">{rank.name}</h4>
                                   </div>

                                   {/* Price */}
                                   <div className="text-center mb-3">
                                     <div className="text-2xl font-black text-foreground">€{rank.price}</div>
                                   </div>

                                   {/* Buy Button */}
                                   {ownedItems.has(rank.id) ? (
                                     <Button
                                       className="font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30 px-6 py-2 text-sm"
                                       disabled
                                     >
                                       <Check className="w-4 h-4 mr-2" />
                                       Owned
                                     </Button>
                                   ) : (
                                     <Button
                                       className={`font-bold transition-all duration-300 bg-gradient-to-r ${rank.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 px-6 py-2 text-sm`}
                                       onClick={() => handlePurchase({
                                         id: rank.id,
                                         name: rank.name,
                                         price: rank.price,
                                         description: rank.perks.join(', '),
                                       })}
                                     >
                                       <ShoppingCart className="w-4 h-4 mr-2" />
                                       Koop Nu
                                     </Button>
                                   )}
                                 </div>
                               </th>
                             );
                           })}
                         </tr>
                       </thead>
                       <tbody>
                         {/* Chat Prefix */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Chat Prefix</td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                         </tr>

                         {/* Keys */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Keys</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">1 Bronze<br/>1 Silver</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">1 Gold<br/>1 Silver</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">1 Gold<br/>1 Platinum</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">1 Extreme<br/>1 Platinum</td>
                         </tr>

                         {/* Gadgets */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Gadgets</td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">Firework</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">Jump Shoes<br/>Fire Trail</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">Elytra Launcher<br/>Totem Trail</td>
                         </tr>

                         {/* Enderchest */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">/Enderchest</td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">10 uses</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">20 uses</td>
                         </tr>

                         {/* Queue Protection */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Queue Protection</td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">30 min</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">2 uur</td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">4 uur</td>
                         </tr>

                         {/* Event Lives */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Extra Event Levens</td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4 text-sm text-gray-300">2 extra</td>
                         </tr>

                         {/* Rank Inheritance */}
                         <tr className="border-b border-purple-800/30 hover:bg-purple-950/20 transition-colors">
                           <td className="py-4 px-6 text-white font-semibold">Alle Voordelen van Lagere Ranks</td>
                           <td className="text-center py-4 px-4"><X className="w-6 h-6 text-red-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                           <td className="text-center py-4 px-4"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                         </tr>
                       </tbody>
                     </table>
                   </div>

             {/* Mobile Card Layout - Hidden on Desktop */}
             <div className="lg:hidden space-y-6">
               {rankPackages.map((rank) => {
                 const Icon = rank.icon;
                 return (
                   <Card key={rank.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br ${rank.bgColor} backdrop-blur-sm border-2 ${rank.borderColor} shadow-xl ${rank.shadowColor} hover:shadow-2xl hover:shadow-current/40`}>
                     {/* Animated Background Gradient */}
                     <div className={`absolute inset-0 bg-gradient-to-br ${rank.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                     {/* Floating Particles */}
                     <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                     <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>

                     <CardHeader className="text-center pb-4 relative z-10">
                       {/* Icon with 3D Effect */}
                       <div className="relative mb-6">
                         <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${rank.color} flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500`}>
                           <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                         </div>
                         {/* Icon Shadow */}
                         <div className={`absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${rank.color} opacity-30 blur-md`}></div>
                       </div>

                       <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                         {rank.name}
                       </CardTitle>

                       {/* Price with Glow */}
                       <div className="relative mt-4">
                         <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                           €{rank.price}
                         </div>
                         <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                       </div>
                     </CardHeader>

                     <CardContent className="px-6 relative z-10">
                       <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                         <div className="space-y-3 text-sm text-white">
                           <div className="flex items-center gap-2">
                             <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                             <span>Chat Prefix</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                             <span>Keys: {rank.name === 'Member+' ? '1 Bronze, 1 Silver' : rank.name === 'Elite' ? '1 Gold, 1 Silver' : rank.name === 'Mythic' ? '1 Gold, 1 Platinum' : '1 Extreme, 1 Platinum'}</span>
                           </div>
                           {rank.name !== 'Member+' && (
                             <div className="flex items-center gap-2">
                               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                               <span>Gadgets: {rank.name === 'Elite' ? 'Firework' : rank.name === 'Mythic' ? 'Jump Shoes, Fire Trail' : 'Elytra Launcher, Totem Trail'}</span>
                             </div>
                           )}
                           {rank.name === 'Mythic' || rank.name === 'Extreme' ? (
                             <div className="flex items-center gap-2">
                               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                               <span>/Enderchest: {rank.name === 'Mythic' ? '10 uses' : '20 uses'}</span>
                             </div>
                           ) : null}
                           {rank.name !== 'Member+' && (
                             <div className="flex items-center gap-2">
                               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                               <span>Queue Protection: {rank.name === 'Elite' ? '30 min' : rank.name === 'Mythic' ? '2 uur' : '4 uur'}</span>
                             </div>
                           )}
                           {rank.name === 'Extreme' && (
                             <div className="flex items-center gap-2">
                               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                               <span>2 Extra Event Levens</span>
                             </div>
                           )}
                           {rank.name !== 'Member+' && (
                             <div className="flex items-center gap-2">
                               <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                               <span>Alle voordelen van lagere ranks</span>
                             </div>
                           )}
                         </div>
                       </div>
                     </CardContent>

                     <CardFooter className="relative z-10 flex items-center justify-center h-16 mt-4">
                       <Button
                         className={`font-bold transition-all duration-300 bg-gradient-to-r ${rank.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 px-6 py-2 text-sm`}
                         onClick={() => handlePurchase({
                           id: rank.id,
                           name: rank.name,
                           price: rank.price,
                           description: rank.perks.join(', '),
                         })}
                       >
                         <ShoppingCart className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                         Koop Nu
                         <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                       </Button>
                     </CardFooter>
                   </Card>
                 );
               })}
             </div>
                 </div>
               </div>
             </div>
           </div>
         );
       case "particles":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-green-500/50 hover:border-green-400/70 shadow-lg hover:shadow-green-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>
 
             {/* Trails Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-green-950/20 to-emerald-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-green-950/80 to-emerald-950/80 backdrop-blur-sm rounded-2xl p-8 border border-green-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                     <Flame className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                     Particle Trails
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                     <Star className="w-6 h-6 text-white" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ml-[20px] md:justify-start">
                   {trails.filter(trail => trail.available).map((trail) => {
                     const rarityColors = {
                       Common: "from-amber-400 to-orange-500",
                       Rare: "from-yellow-400 to-amber-500",
                       Epic: "from-cyan-400 to-blue-500",
                       Legendary: "from-blue-400 to-indigo-500"
                     };

                     return (
                       <Card key={trail.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 bg-gradient-to-br from-green-950/90 to-emerald-900/90 backdrop-blur-sm border-2 border-green-700/70 shadow-xl shadow-green-900/40 hover:shadow-2xl hover:shadow-current/40 h-[450px] flex flex-col`}>
                         {/* Animated Background Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                         {/* Floating Particles */}
                         <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                         <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>



                         {/* Glow Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                         <CardHeader className="text-center pb-4 relative z-10">
                           {/* Icon with 3D Effect */}
                           <div className="relative mb-6">
                             <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500">
                               <div className="text-2xl">{trail.emoji}</div>
                             </div>
                             {/* Icon Shadow */}
                             <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 opacity-30 blur-md"></div>
                           </div>

                           <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                             {trail.name}
                           </CardTitle>

                           {/* Price with Glow */}
                           <div className="relative mt-4">
                             <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                               €{trail.price}
                             </div>
                             <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                           </div>
                         </CardHeader>

                         <CardContent className="px-6 relative z-10 flex-1">
                           <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                             <div className="text-sm text-foreground text-center">
                               {trail.description}
                             </div>
                           </div>
                         </CardContent>

                         <CardFooter className="pt-6 relative z-10 mt-auto">
                           <div className="flex flex-col gap-2 items-center pl-2">
                             <Button
                               variant="outline"
                               onClick={() => handleInfo(trail)}
                               className="w-full h-10 font-bold transition-all duration-300 border-white/30 text-white hover:bg-white/10 py-2 px-3 text-sm"
                             >
                               <Info className="w-4 h-4 mr-1" />
                               Info
                             </Button>
                             {ownedItems.has(trail.id) ? (
                               <Button
                                 className="w-full h-10 font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 disabled
                               >
                                 <Check className="w-4 h-4 mr-1" />
                                 Owned
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             ) : (
                               <Button
                                 className="w-full h-10 font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 onClick={() => handlePurchase({
                                   id: trail.id,
                                   name: trail.name,
                                   price: trail.price,
                                   description: trail.description,
                                 })}
                               >
                                 <ShoppingCart className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                                 Koop Nu
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             )}
                           </div>
                         </CardFooter>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>
         );
       case "gadgets":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-orange-500/50 hover:border-orange-400/70 shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>

             {/* Gadgets Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-orange-950/20 to-red-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-orange-950/80 to-red-950/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                     <Zap className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                     Gadgets
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                     <Star className="w-6 h-6 text-white" />
                   </div>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-start">
                   {gadgets.map((gadget) => {
                     const rarityColors = {
                       Common: "from-amber-400 to-orange-500",
                       Rare: "from-yellow-400 to-amber-500",
                       Epic: "from-cyan-400 to-blue-500",
                       Legendary: "from-blue-400 to-indigo-500",
                       Mythic: "from-purple-400 to-pink-500"
                     };

                     return (
                       <Card key={gadget.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 border-orange-700/70 bg-gradient-to-br from-orange-950/90 to-red-900/90 backdrop-blur-sm border-2 shadow-xl shadow-orange-900/40 hover:shadow-2xl hover:shadow-current/40 h-[450px] flex flex-col`}>
                         {/* Animated Background Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                         {/* Floating Particles */}
                         <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                         <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>

                         {/* Glow Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                         <CardHeader className="text-center pb-4 relative z-10">
                           {/* Icon with 3D Effect */}
                           <div className="relative mb-6">
                             <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500">
                               <div className="text-2xl">{gadget.emoji}</div>
                             </div>
                             {/* Icon Shadow */}
                             <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 opacity-30 blur-md"></div>
                           </div>

                           <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                             {gadget.name}
                           </CardTitle>

                           {/* Price with Glow */}
                           <div className="relative mt-4">
                             <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                               €{gadget.price}
                             </div>
                             <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                           </div>
                         </CardHeader>

                         <CardContent className="px-6 relative z-10 flex-1">
                           <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                             <div className="text-sm text-foreground text-center">
                               {gadget.description}
                             </div>
                           </div>
                         </CardContent>

                         <CardFooter className="pt-6 relative z-10 mt-auto">
                           {/* BUTTON POSITION ADJUSTER - Desktop: -5px, Mobile: -20px */}
                           <div className="flex gap-2 w-full items-center ml-[-20px] md:ml-[-5px]">
                             <Button
                               variant="outline"
                               onClick={() => handleInfo(gadget)}
                               className="flex-1 h-10 font-bold transition-all duration-300 border-white/30 text-white hover:bg-white/10 py-2 px-3 text-sm"
                             >
                               <Info className="w-4 h-4 mr-1" />
                               Info
                             </Button>
                             {ownedItems.has(gadget.id) ? (
                               <Button
                                 className="flex-1 h-10 font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 disabled
                               >
                                 <Check className="w-4 h-4 mr-1" />
                                 Owned
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             ) : (
                               <Button
                                 className="flex-1 h-10 font-bold transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 onClick={() => handlePurchase({
                                   id: gadget.id,
                                   name: gadget.name,
                                   price: gadget.price,
                                   description: gadget.description,
                                 })}
                               >
                                 <ShoppingCart className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                                 Koop Nu
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             )}
                           </div>
                         </CardFooter>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>
         );
       case "keys":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-blue-500/50 hover:border-blue-400/70 shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>

             {/* Lobby Keys Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-purple-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-blue-950/80 to-purple-950/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                     <div className="text-2xl">🏠</div>
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                     Lobby Keys
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                     <div className="text-2xl">🎯</div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-start">
                   {lobbyKeys.map((key, index) => {
                     const Icon = key.icon;
                     const rarityColors = {
                       Common: "from-amber-400 to-orange-500",
                       Uncommon: "from-slate-400 to-slate-600",
                       Rare: "from-yellow-400 to-amber-500",
                       Epic: "from-cyan-400 to-blue-500",
                       Legendary: "from-blue-400 to-indigo-500",
                       Mythic: "from-red-400 to-pink-500"
                     };

                     return (
                       <Card key={key.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 ${key.borderColor} bg-gradient-to-br ${key.bgColor} backdrop-blur-sm border-2 shadow-xl ${key.shadowColor} hover:shadow-2xl hover:shadow-current/40 min-h-[500px] flex flex-col`}>
                         {/* Animated Background Gradient */}
                         <div className={`absolute inset-0 bg-gradient-to-br ${key.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                         {/* Floating Particles */}
                         <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                         <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>

                         {/* Rarity Badge */}
                         <div className="absolute top-4 left-4 z-10">
                           <Badge className={`bg-gradient-to-r ${rarityColors[key.rarity as keyof typeof rarityColors]} text-white font-bold px-3 py-1 shadow-lg`}>
                             {key.emoji} {key.rarity}
                           </Badge>
                         </div>

                         {/* Glow Effect */}
                         <div className={`absolute inset-0 bg-gradient-to-r ${key.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>

                         <CardHeader className="text-center pb-4 relative z-10">
                           {/* Icon with 3D Effect */}
                           <div className="relative mb-6">
                             <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${key.color} flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500`}>
                               <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                             </div>
                             {/* Icon Shadow */}
                             <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${key.color} opacity-30 blur-md`}></div>
                           </div>

                           <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                             {key.name}
                           </CardTitle>

                           {/* Price with Glow */}
                           <div className="relative mt-4">
                             <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                               €{key.price}
                             </div>
                             <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                           </div>
                         </CardHeader>

                         <CardContent className="px-6 relative z-10 flex-1">
                           <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                             <ul className="text-sm text-white space-y-2">
                               {key.perks.slice(0, 3).map((perk, perkIndex) => (
                                 <li key={perkIndex} className="flex items-start gap-2 group/item">
                                   <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                   <span className="group-hover/item:text-white transition-colors">{perk}</span>
                                 </li>
                               ))}
                               {key.perks.length > 3 && (
                                 <li className="text-xs text-white italic">
                                   +{key.perks.length - 3} meer voordelen...
                                 </li>
                               )}
                             </ul>
                           </div>
                         </CardContent>

                         <CardFooter className="pt-6 relative z-10 mt-auto">
                           {/* BUTTON POSITION ADJUSTER - Desktop: -5px, Mobile: -20px */}
                           <div className="flex gap-2 w-full items-center ml-[-20px] md:ml-[-5px]">
                             <Button
                               variant="outline"
                               onClick={() => handleInfo(key)}
                               className="flex-1 h-10 font-bold transition-all duration-300 border-white/30 text-white hover:bg-white/10 py-2 px-3 text-sm"
                             >
                               <Info className="w-4 h-4 mr-1" />
                               Info
                             </Button>
                             <Button
                               className={`flex-1 h-10 font-bold transition-all duration-300 bg-gradient-to-r ${key.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 py-2 px-3 text-sm`}
                               onClick={() => handlePurchase({
                                 id: key.id,
                                 name: key.name,
                                 price: key.price,
                                 description: key.perks.join(', '),
                               })}
                             >
                               <ShoppingCart className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                               Koop Nu
                               <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                             </Button>
                           </div>
                         </CardFooter>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>

             {/* Skyblock Keys Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 to-green-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-emerald-950/80 to-green-950/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                     <div className="text-2xl">🌍</div>
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                     Skyblock Keys
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                     <div className="text-2xl">🏝️</div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-start">
                   {skyblockKeys.map((key, index) => {
                     const Icon = key.icon;
                     const rarityColors = {
                       Common: "from-emerald-400 to-green-500",
                       Uncommon: "from-sky-400 to-blue-500",
                       Rare: "from-purple-400 to-violet-500",
                       Epic: "from-orange-400 to-red-500",
                       Legendary: "from-rose-400 to-pink-500",
                       Mythic: "from-fuchsia-400 to-purple-500"
                     };

                     return (
                       <Card key={key.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 ${key.borderColor} bg-gradient-to-br ${key.bgColor} backdrop-blur-sm border-2 shadow-xl ${key.shadowColor} hover:shadow-2xl hover:shadow-current/40 min-h-[500px] flex flex-col w-full max-w-sm`}>
                         {/* Animated Background Gradient */}
                         <div className={`absolute inset-0 bg-gradient-to-br ${key.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                         {/* Floating Particles */}
                         <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                         <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>

                         {/* Rarity Badge */}
                         <div className="absolute top-4 left-4 z-10">
                           <Badge className={`bg-gradient-to-r ${rarityColors[key.rarity as keyof typeof rarityColors]} text-white font-bold px-3 py-1 shadow-lg`}>
                             {key.emoji} {key.rarity}
                           </Badge>
                         </div>

                         {/* Glow Effect */}
                         <div className={`absolute inset-0 bg-gradient-to-r ${key.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>

                         <CardHeader className="text-center pb-4 relative z-10">
                           {/* Icon with 3D Effect */}
                           <div className="relative mb-6">
                             <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${key.color} flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500`}>
                               <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                             </div>
                             {/* Icon Shadow */}
                             <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${key.color} opacity-30 blur-md`}></div>
                           </div>

                           <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                             {key.name}
                           </CardTitle>

                           {/* Price with Glow */}
                           <div className="relative mt-4">
                             <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                               €{key.price}
                             </div>
                             <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                           </div>
                         </CardHeader>

                         <CardContent className="px-6 relative z-10 flex-1">
                           <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                             <ul className="text-sm text-white space-y-2">
                               {key.perks.slice(0, 3).map((perk, perkIndex) => (
                                 <li key={perkIndex} className="flex items-start gap-2 group/item">
                                   <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                   <span className="group-hover/item:text-white transition-colors">{perk}</span>
                                 </li>
                               ))}
                               {key.perks.length > 3 && (
                                 <li className="text-xs text-white italic">
                                   +{key.perks.length - 3} meer voordelen...
                                 </li>
                               )}
                             </ul>
                           </div>
                         </CardContent>

                         <CardFooter className="pt-6 relative z-10 mt-auto">
                           {/* BUTTON POSITION ADJUSTER - Desktop: -5px, Mobile: -20px */}
                           <div className="flex gap-2 w-full items-center ml-[-20px] md:ml-[-5px]">
                             <Button
                               variant="outline"
                               onClick={() => handleInfo(key)}
                               className="flex-1 h-10 font-bold transition-all duration-300 border-white/30 text-white hover:bg-white/10 py-2 px-3 text-sm"
                             >
                               <Info className="w-4 h-4 mr-1" />
                               Info
                             </Button>
                             <Button
                               className={`flex-1 h-10 font-bold transition-all duration-300 bg-gradient-to-r ${key.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 py-2 px-3 text-sm`}
                               onClick={() => handlePurchase({
                                 id: key.id,
                                 name: key.name,
                                 price: key.price,
                                 description: key.perks.join(', '),
                               })}
                             >
                               <ShoppingCart className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                               Koop Nu
                               <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                             </Button>
                           </div>
                         </CardFooter>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>
         );
       case "nametags":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white border-pink-500/50 hover:border-pink-400/70 shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>

             {/* Nametags Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-pink-950/20 to-rose-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-pink-950/80 to-rose-950/80 backdrop-blur-sm rounded-2xl p-8 border border-pink-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30">
                     <Star className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                     Nametag Prefixes
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                     <Crown className="w-6 h-6 text-white" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {nametagPrefixes.map((prefix) => {
                     const rarityColors = {
                       Common: "from-amber-400 to-orange-500",
                       Rare: "from-yellow-400 to-amber-500",
                       Epic: "from-cyan-400 to-blue-500",
                       Legendary: "from-blue-400 to-indigo-500"
                     };

                     return (
                       <Card key={prefix.id} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 bg-gradient-to-br from-pink-950/90 to-rose-900/90 backdrop-blur-sm border-2 border-pink-700/70 shadow-xl shadow-pink-900/40 hover:shadow-2xl hover:shadow-current/40 min-h-[400px] flex flex-col`}>
                         {/* Animated Background Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-rose-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                         {/* Floating Particles */}
                         <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                         <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>



                         {/* Glow Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                         <CardHeader className="text-center pb-4 relative z-10">
                           {/* Icon with 3D Effect */}
                           <div className="relative mb-6">
                             <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-current/50 group-hover:rotate-12 transition-transform duration-500">
                               <div className="text-4xl">{prefix.emoji}</div>
                             </div>
                             {/* Icon Shadow */}
                             <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-rose-600 opacity-30 blur-md"></div>
                           </div>

                           <CardTitle className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                             {prefix.name}
                           </CardTitle>

                           {/* Prefix Display */}
                           <div className="text-lg text-muted-foreground font-mono bg-white/20 rounded-lg px-3 py-1 mt-2">
                             {prefix.prefix}
                           </div>

                           {/* Price with Glow */}
                           <div className="relative mt-4">
                             <div className="text-4xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                               €{prefix.price}
                             </div>
                             <div className="absolute inset-0 text-4xl font-black text-current opacity-20 blur-sm"></div>
                           </div>
                         </CardHeader>

                         <CardFooter className="pt-6 relative z-10 mt-auto px-4 pb-4">
                           <div className="flex flex-col gap-2 w-full">
                             <Button
                               variant="outline"
                               onClick={() => handleInfo(prefix)}
                               className="w-full h-10 font-bold transition-all duration-300 border-white/30 text-white hover:bg-white/10 py-2 px-3 text-sm"
                             >
                               <Info className="w-4 h-4 mr-1" />
                               Info
                             </Button>
                             {ownedItems.has(prefix.id) ? (
                               <Button
                                 className="w-full h-10 font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 disabled
                               >
                                 <Check className="w-4 h-4 mr-1" />
                                 Owned
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             ) : (
                               <Button
                                 className="w-full h-10 font-bold transition-all duration-300 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 py-2 px-3 text-sm"
                                 onClick={() => handlePurchase({
                                   id: prefix.id,
                                   name: prefix.name,
                                   price: prefix.price,
                                   description: `Prefix: ${prefix.prefix}`,
                                 })}
                               >
                                 <ShoppingCart className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                                 Koop Nu
                                 <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                               </Button>
                             )}
                           </div>
                         </CardFooter>
                       </Card>
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>
         );
       case "donate":
         return (
           <div className="space-y-16">
             {/* Back Button */}
             <div className="flex justify-start mb-6">
               <Button
                 variant="outline"
                 onClick={() => setCurrentView("home")}
                 className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white border-yellow-500/50 hover:border-yellow-400/70 shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Terug naar Categorieën
               </Button>
             </div>

             {/* Donate Section */}
             <div className="relative">
               {/* Section Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/20 to-amber-950/20 rounded-2xl blur-3xl"></div>

               <div className="relative bg-gradient-to-br from-yellow-950/80 to-amber-950/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-800/50">
                 <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                     <div className="text-3xl">💰</div>
                   </div>
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                     Doneer aan DeltaMC
                   </h3>
                   <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                     <div className="text-3xl">❤️</div>
                   </div>
                 </div>

                 <div className="text-center mb-8">
                   <p className="text-xl text-white max-w-2xl mx-auto">
                     Jouw donatie helpt ons om DeltaMC te verbeteren en nieuwe features toe te voegen.
                     Alle donaties worden zeer gewaardeerd! 💝
                   </p>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[1, 5, 10, 15, 20, 30, 40, 50].map((amount) => (
                     <Card key={amount} className="group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-yellow-950/90 to-amber-900/90 backdrop-blur-sm border-2 border-yellow-700/70 shadow-xl shadow-yellow-900/40 hover:shadow-2xl hover:shadow-current/40">
                       {/* Animated Background Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                       {/* Floating Particles */}
                       <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full opacity-60 animate-ping"></div>
                       <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full opacity-40 animate-ping delay-300"></div>

                       {/* Glow Effect */}
                       <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                       <CardContent className="p-6 text-center relative z-10">
                         <div className="text-5xl font-black text-foreground drop-shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                           €{amount}
                         </div>
                         <div className="text-sm text-yellow-200 mb-4">
                           Eenmalige donatie
                         </div>
                       </CardContent>

                       <CardFooter className="pt-0 relative z-10 flex items-center justify-center h-16 mt-4">
                         <Button
                           className="font-bold transition-all duration-300 bg-gradient-to-r from-yellow-600 to-amber-600 hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-current/30 group-hover:scale-105 px-6 py-2 text-sm"
                           onClick={() => handlePurchase({
                             id: `donate-${amount}`,
                             name: `Donatie €${amount}`,
                             price: amount,
                             description: `Donatie van €${amount} aan DeltaMC`,
                           })}
                         >
                           <div className="text-xl mr-2">💰</div>
                           Doneer €{amount}
                           <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                         </Button>
                       </CardFooter>
                     </Card>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         );
       default:
         return null;
     }
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Navbar />

       {/* Header */}
       <section className="pt-32 pb-16">
         <div className="container mx-auto px-4 text-center">
           <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
             <span className="text-foreground">DELTA MC </span>
             <span className="text-foreground">SHOP</span>
           </h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
             Ontdek onze exclusieve collectie van ranks, keys, cosmetics en meer!
           </p>
         </div>
       </section>

       {/* Shop Interface */}
       <section className="pb-24">
         <div className="container mx-auto px-4">
           {/* Mobile-first responsive layout */}
           <div className="flex flex-col lg:flex-row gap-8">
             {/* Sidebar - Below main content on mobile, left side on desktop */}
             <aside className="w-full lg:w-72 order-1 lg:order-1 space-y-6">
               <RecentSupporters />

               {/* Giftcard Redeem */}
               <div className="w-full">
                 <GiftcardRedeem />
               </div>
             </aside>

             {/* Main Content - Full width on mobile, flex-1 on desktop */}
             <main className="w-full lg:flex-1 order-2 lg:order-2">
               {/* Content */}
               {renderContent()}
             </main>
           </div>
         </div>
       </section>

       <Footer />

       {/* Info Dialog */}
       <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
         <DialogContent className="sm:max-w-[500px]">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2">
               {selectedItem?.emoji && <span className="text-2xl">{selectedItem.emoji}</span>}
               {selectedItem?.name}
             </DialogTitle>
             <DialogDescription>
               {selectedItem?.description || "Alle voordelen van dit item:"}
             </DialogDescription>
           </DialogHeader>
           <div className="mt-4">
             {/* Show all perks for keys */}
             {selectedItem?.perks && (
               <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                 <h4 className="font-semibold text-white mb-3">Alle Voordelen:</h4>
                 <ul className="text-sm text-white space-y-2">
                   {selectedItem.perks.map((perk: string, index: number) => (
                     <li key={index} className="flex items-start gap-2">
                       <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                       <span>{perk}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             {/* Placeholder for future image */}
             <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground mt-4">
               Afbeelding komt hier
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   );
 };

 export default Shop;
