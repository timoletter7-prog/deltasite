import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Sword, Mountain, Heart, Skull, Clock } from "lucide-react";
import { getOnlinePlayersByGamemode } from "@/lib/supabase";
import skyblockImg from "@/assets/skyblock.png";
import survivalImg from "@/assets/survival.jpg";
import lifestealImg from "@/assets/lifesteal.png";
import hardcoreImg from "@/assets/hardcore.jpg";
import hardcore_langImg from "@/assets/hardcore_lang.jpg";
import survival_langImg from "@/assets/survival_lang.jpg";

const baseGamemodes = [
  {
    name: "Survival",
    description: "Welkom bij survival, een gewone server waar je met vrienden,zus of broer en als streamer of content creator kunt spelen! Aan deze server zitten niet veel plugins dus ook minder lagg en meer zoals de oude tijden. Maak een epische base overleef met je vrienden en maak er een mooie survival server van!", 
    image: survival_langImg,
    players: 112,
    slug: "survival",
    icon: Sword,
    features: ["Economy", "Custom Enchants", "Weekly Events", "PvP Arena's"],
    comingSoon: false,
  },
  {
    name: "Hardcore",
    description: "Hardcore de gevaarlijkste gamemode van minecraft als je dood gaat kan je niet meer respawnen! Overleef in een wereld met betrayal, moeilijke situaties…. . Een fout en je bent dood dus verzamel zo snel mogelijk grondstoffen, maak teams en overleef!",
    image: hardcore_langImg,
    players: 34,
    slug: "hardcore",
    icon: Skull,
    features: ["Permadeath", "Seasonal Resets", "Leaderboards",  "Extreme Difficulty"],
    comingSoon: false,
  },
  {
    name: "Skyblock",
    description: "Skyblock je begint klein en maakt je eiland groter hoe groot je wilt met alle soorten upgrades! Koop ook minions met coins of krijg er via onze shop. Ben je een streamer perfect want hier kan je zoveel streamen dat je wilt en tonen hoe je je sky eiland groter maakt. Maak dat je niet in de void valt of je verlies je spullen!",
    image: skyblockImg,
    players: 0,
    slug: "skyblock",
    icon: Mountain,
    features: ["Island Levels", "Custom Generators", "Minions", "Island Missions", "Leaderboards"],
    comingSoon: true,
  },
  {
    name: "Lifesteal",
    description: "Lifesteal ga dood of word door iemand gekild en je verliest een hartje! Elke keer als je een hartje verliest is er nog meer kans dat je volledig wordt geëlimineerd als je op 0 hartjes komt. Overleef, vecht voor hartjes, trade en maak minigames met hartjes om het extra leuk te maken!",
    image: lifestealImg,
    players: 0,
    slug: "lifesteal",
    icon: Heart,
    features: ["Heart Stealing", "Heart Trading", "Seasonal Resets", " revive beacon"],
    comingSoon: true,
  },
];

const Gamemodes = () => {
  const [gamemodes, setGamemodes] = useState(baseGamemodes);

  useEffect(() => {
    const fetchOnlinePlayers = async () => {
      try {
        const onlinePlayers = await getOnlinePlayersByGamemode();
        const updatedGamemodes = baseGamemodes.map(gamemode => ({
          ...gamemode,
          players: onlinePlayers[gamemode.slug] || 0
        }));
        setGamemodes(updatedGamemodes);
      } catch (error) {
        console.error('Error fetching online players:', error);
        // Keep default values if fetch fails
      }
    };

    fetchOnlinePlayers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOnlinePlayers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">ALLE </span>
            <span className="text-gradient-primary">GAMEMODES</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Ontdek alle gamemodes die Delta MC te bieden heeft. Van relaxte survival tot intense PvP - er is voor iedereen wat!
          </p>
        </div>
      </section>

      {/* Gamemodes List */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {gamemodes.map((gamemode, index) => {
              const Icon = gamemode.icon;
              return (
                <div
                  key={gamemode.slug}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  } ${gamemode.comingSoon ? "opacity-70" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-elevated">
                      <img
                        src={gamemode.image}
                        alt={gamemode.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      
                      {/* Coming Soon Overlay */}
                      {gamemode.comingSoon && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                              <Clock className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <span className="font-display text-2xl font-bold text-foreground">Coming Soon</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Player Count */}
                      {!gamemode.comingSoon && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-display">{gamemode.players} online</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        gamemode.comingSoon 
                          ? "bg-secondary" 
                          : "bg-gradient-primary glow-primary"
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          gamemode.comingSoon 
                            ? "text-muted-foreground" 
                            : "text-primary-foreground"
                        }`} />
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {gamemode.name}
                      </h2>
                      {gamemode.comingSoon && (
                        <span className="bg-secondary px-3 py-1 rounded-full text-xs font-display text-muted-foreground uppercase tracking-wider">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    
                    <p className="text-lg text-muted-foreground mb-6 font-body">
                      {gamemode.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {gamemode.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-secondary px-4 py-2 rounded-full text-sm font-display text-secondary-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {gamemode.comingSoon ? (
                      <Button variant="outline" size="lg" disabled>
                        <Clock className="w-5 h-5" />
                        <span>Binnenkort Beschikbaar</span>
                      </Button>
                    ) : (
                      <Link to={`/gamemodes/${gamemode.slug}`}>
                        <Button variant="hero" size="lg" className="group">
                          <span>Bekijk Details</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gamemodes;
