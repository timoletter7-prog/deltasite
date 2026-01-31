import GamemodeCard from "./GamemodeCard";
import { useState, useEffect, useCallback } from "react";
import { getOnlinePlayersByGamemode } from "@/lib/supabase";
import skyblockImg from "@/assets/skyblock.png";
import survivalImg from "@/assets/survival.jpg";
import lifestealImg from "@/assets/lifesteal.png";
import hardcoreImg from "@/assets/hardcore.jpg";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const baseGamemodes = [
  {
    name: "Survival",
    description: "Bouw je eigen base, speel samen met vrienden en beleef survival zoals vroeger.\nMinder plugins, minder lag en puur plezier.",
    image: survivalImg,
    players: 112,
    slug: "survival",
    comingSoon: false,
  },
  {
    name: "Hardcore",
    description: "Eén leven. Geen respawn. Overleef in een keiharde wereld vol gevaar, betrayal en spanning.",
    image: hardcoreImg,
    players: 34,
    slug: "hardcore",
    comingSoon: false,
  },
  {
    name: "Skyblock",
    description: "Begin op een klein eiland en bouw het uit tot iets groots. Upgrades, minions en eindeloze mogelijkheden.",
    image: skyblockImg,
    players: 0,
    slug: "skyblock",
    comingSoon: true,
  },
  {
    name: "Lifesteal",
    description: "Intense PvP actie waar je harten steelt van andere spelers. Verlies je alle harten? Dan ben je uit het spel!",
    image: lifestealImg,
    players: 0,
    slug: "lifesteal",
    comingSoon: true,
  },
];

const GamemodesSection = () => {
  const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPlayerCounts = async () => {
      const counts = await getOnlinePlayersByGamemode();
      setPlayerCounts(counts);
    };

    fetchPlayerCounts();

    // Update every 30 seconds
    const interval = setInterval(fetchPlayerCounts, 30000);

    return () => clearInterval(interval);
  }, []);

  // Create gamemodes with dynamic player count
  const gamemodesWithCount = baseGamemodes.map(gamemode => ({
    ...gamemode,
    players: playerCounts[gamemode.slug] || 0,
  }));

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">ONZE </span>
            <span className="text-gradient-primary">GAMEMODES</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Kies je favoriete gamemode en begin je avontuur op Delta MC!
          </p>
        </div>

        {/* Gamemode Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gamemodesWithCount.map((gamemode, index) => (
            <GamemodeCard key={gamemode.slug} {...gamemode} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamemodesSection;
