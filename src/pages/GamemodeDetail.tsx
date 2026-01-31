import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, Users, Star, Trophy, Zap, Skull, ChevronDown } from "lucide-react";

import skyblockImg from "@/assets/skyblock_lang.png";
import survival_langImg from "@/assets/survival_lang.jpg";
import hardcore_langImg from "@/assets/hardcore_lang.jpg";
import lifesteal_langImg from "@/assets/lifesteal_lang.png";

const gamemodesData: Record<string, any> = {
  survival: {
    name: "Survival",
    description: "Klassieke survival ervaring met een twist. Claim land, bouw bases en overleef samen.",
    image: survival_langImg,
    players: 112,
    howToJoin: [
      "Join via play.deltamc.nl",
      "Type /survival of klik het bord",
      "Gebruik /rtp voor een startplek",
      "Claim land en begin met bouwen",
    ],
    features: [
      { title: "Maak mooie builds", description: "Laat je creativiteit zien", icon: Star },
      { title: "Economy", description: "Handel met spelers", icon: Zap },
      { title: "Gewone enchants en normale gear upgrade", description: "Standaard Minecraft enchants", icon: Trophy },
    ],
    tips: [
      "Speel samen met anderen",
      "Beleef alles zoals vroeger",
      "Maak je klaar voor sommige twists",
    ],
  },

  hardcore: {
    name: "Hardcore",
    description: "Eén leven. Permanente dood. Alleen de sterksten overleven.",
    image: hardcore_langImg,
    players: 34,
    howToJoin: [
      "Join via play.deltamc.nl",
      "Type /hardcore of klik het bord",
      "Je krijgt één leven",
      "Overleef zo lang mogelijk",
    ],
    features: [
      { title: "Permadeath", description: "Eén leven per seizoen", icon: Skull },
      { title: "Seasonal Resets", description: "Nieuwe start elke maand", icon: Zap },
      { title: "Leaderboards", description: "Wie overleeft het langst?", icon: Trophy },
    ],
    tips: [
      "Neem geen risico’s",
      "Bouw eerst een veilige base",
      "Vertrouw niemand zomaar",
    ],
  },

  skyblock: {
    name: "Skyblock",
    description: "Begin op een eiland en bouw je wereld vanuit niets.",
    image: skyblockImg,
    players: 89,
    howToJoin: [
      "Join via play.deltamc.nl",
      "Type /skyblock",
      "Maak een eiland met /is create",
      "Breid je eiland uit",
    ],
    features: [
      { title: "Island Levels", description: "Upgrade je eiland", icon: Star },
      { title: "Custom Generators", description: "Speciale ores", icon: Zap },
      { title: "Leaderboards", description: "Beste eilanden", icon: Trophy },
    ],
    tips: [
      "Goede cobble gen maken",
      "Farms bouwen voor geld",
      "Speel samen voor bonus XP",
    ],
  },

  lifesteal: {
    name: "Lifesteal",
    description: "Steel harten van andere spelers in intense PvP.",
    image: lifesteal_langImg,
    players: 46,
    howToJoin: [
      "Join via play.deltamc.nl",
      "Type /lifesteal",
      "Start met 10 harten",
      "Steel harten door kills",
    ],
    features: [
      { title: "Heart Stealing", description: "Harten per kill", icon: Star },
      { title: "Bounties", description: "Zet prijzen op spelers", icon: Zap },
      { title: "Kill Streaks", description: "Bonus rewards", icon: Trophy },
    ],
    tips: [
      "Farm eerst goede gear",
      "Speel slim PvP",
      "Maak tijdelijke allies",
    ],
  },
};

export default function GamemodeDetail() {
  const { slug } = useParams();
  const gamemode = slug ? gamemodesData[slug] : null;
  const serverIP = "play.deltamc.nl";
  const [copied, setCopied] = useState(false);

  if (!gamemode) return null;

  const copyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (slug === 'hardcore') {
      window.scrollTo({ top: 400, behavior: "smooth" });
    } else if (slug === 'survival') {
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  }, [slug]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-20">
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{
            backgroundImage: `url(${gamemode.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Donkere overlay */}
          <div className={`absolute inset-0 ${slug === 'hardcore' ? 'bg-black/60' : slug === 'survival' ? 'bg-black/0' : 'bg-black/70'}`} />
          {/* Extra sfeer / focus */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85" />

          {/* Content */}
          <div className="absolute inset-0 z-10 flex justify-center">
            <div className={`container mx-auto px-4 text-center flex flex-col items-center ${slug === 'survival' ? 'mt-[1050px]' : slug === 'hardcore' ? 'mt-[850px]' : 'mt-[150px]'}`}>
              <Link to="/gamemodes" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4">
                <ArrowLeft className="w-4 h-4" />
                Terug naar Gamemodes
              </Link>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {gamemode.name}
              </h1>

              <div className="flex justify-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-white">{gamemode.players} spelers</span>
              </div>

              <p className={`text-white/80 text-lg ${slug === 'survival' ? 'mt-12' : ''}`}>
                {gamemode.description}
              </p>

              <ChevronDown className="w-8 h-8 text-white/70 animate-bounce mt-[250px]" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT KOMT MOOI OMHOOG */}
      <section className={`${slug === 'hardcore' ? '-mt20' : '-mt-0'} relative z-0 pb-20`}>
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">

          {/* HOW TO JOIN */}
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">HOE JOIN IK?</h2>

            <div className="space-y-4">
              {gamemode.howToJoin.map((step: string, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-xl font-bold">{serverIP}</span>
              <Button onClick={copyIP}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* FEATURES + TIPS */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4">Features</h3>
              <div className="space-y-4">
                {gamemode.features.map((f: any) => (
                  <div key={f.title} className="flex gap-4">
                    <f.icon className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-bold">{f.title}</h4>
                      <p className="text-muted-foreground text-sm">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Tips voor Beginners</h3>
              <ul className="space-y-2">
                {gamemode.tips.map((tip: string, i: number) => (
                  <li key={i} className="text-muted-foreground">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
