import { useState, useEffect, useCallback } from "react";
import { Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOnlinePlayersByGamemode } from "@/lib/supabase";
import heroBg from "@/assets/hero-bg.jpg";
import EventBox from "@/components/EventBox";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Hero = () => {
  const [copied, setCopied] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const serverIP = "play.deltamc.nl";

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      const counts = await getOnlinePlayersByGamemode();
      const totalCount = Object.values(counts as Record<string, number>).reduce((sum, count) => sum + (count as number), 0);
      setPlayerCount(totalCount);
    };

    fetchPlayerCount();
    const interval = setInterval(fetchPlayerCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = serverIP;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Particles (ALLEEN HERO) */}
      <Particles
        id="hero-particles"
        init={particlesInit}
        className="absolute inset-0 z-[1] pointer-events-none"
        options={{
          fpsLimit: 60,
          fullScreen: false,
          particles: {
            number: {
              value: 100,
              density: { enable: true, area: 800 }
            },
            color: { value: ["#1aff8c", "#00ffcc"] },
            opacity: { value: 0.6, random: true },
            size: { value: { min: 1, max: 2 } },
            move: {
              enable: true,
              speed: 0.6,
              direction: "bottom",
              random: true,
              outModes: {
                default: "out"
              }
            },
            shape: { type: "circle" }
          },
          detectRetina: true,
          background: { color: "transparent" }
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 text-center">

        {/* Player count */}
        <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3 mb-8">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <Users className="w-5 h-5 text-primary" />
          <span className="text-lg">
            <span className="text-primary font-bold">{playerCount}</span>
            <span className="text-muted-foreground ml-2">Spelers Online</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-6">
          WELKOM OP <br /> DELTA MC
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Ontdek de beste Minecraft ervaring met DeltaMC, Hide and Seek en nog veel meer!
        </p>

        {/* IP */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div
            onClick={copyIP}
            className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border-2 border-primary rounded-lg px-6 py-4 cursor-pointer group"
          >
            <span className="text-xl md:text-2xl">
              {serverIP}
            </span>
            {copied ? (
              <Check className="w-6 h-6 text-primary" />
            ) : (
              <Copy className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            )}
          </div>

          <Button variant="hero" size="xl" onClick={copyIP}>
            {copied ? "Gekopieerd!" : "Kopieer IP"}
          </Button>
        </div>

        {/* Event */}
        <div className="mt-8">
          <EventBox />
        </div>
      </div>
    </section>
  );
};

export default Hero;
