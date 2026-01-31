import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Gamemodes from "./pages/Gamemodes";
import GamemodeDetail from "./pages/GamemodeDetail";
import Events from "./pages/Events";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout.tsx";
import EventReward from "./pages/EventReward";
import EventRewardCheckout from "./pages/EventRewardCheckout";
import Tutorial from "./pages/Tutorial";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gamemodes" element={<Gamemodes />} />
              <Route path="/gamemodes/:slug" element={<GamemodeDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/event-reward" element={<EventReward />} />
              <Route path="/event-reward-checkout" element={<EventRewardCheckout />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
