import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GamemodesSection from "@/components/GamemodesSection";
import Footer from "@/components/Footer";
import { useState, useEffect, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Index = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] relative">
      <Particles
        id="hero-particles"
        init={particlesInit}
        className="fixed inset-0 z-0 pointer-events-none"
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 120, density: { enable: true, area: 800 } },
            color: { value: ["#1aff8c", "#00ffcc"] },
            opacity: { value: 0.7, random: true },
            size: { value: { min: 1, max: 2 } },
            move: {
              enable: true,
              speed: 0.8,
              direction: "bottom",
              random: true,
              outModes: { bottom: "none", default: "out" }
            },
            shape: { type: "circle" },
            life: { duration: { sync: false, value: 10 }, count: 1 }
          },
          emitters: [
            {
              position: { x: 10, y: 0 },
              rate: { quantity: 1, delay: 2 },
              particles: {
                number: { value: 1 },
                color: { value: "#8B4513" },
                opacity: { value: 0.8 },
                size: { value: { min: 4, max: 6 } },
                move: {
                  enable: true,
                  speed: 1,
                  direction: "bottom",
                  straight: false,
                  outModes: { bottom: "none", default: "out" }
                },
                shape: { type: "polygon", polygon: { nb_sides: 5 } },
                life: { duration: { sync: false, value: 10 }, count: 1 },
                rotate: { value: 45, animation: { enable: true, speed: 5, sync: false } }
              }
            },
            {
              position: { x: 50, y: 0 },
              rate: { quantity: 1, delay: 2.5 },
              particles: {
                number: { value: 1 },
                color: { value: "#8B4513" },
                opacity: { value: 0.8 },
                size: { value: { min: 4, max: 6 } },
                move: {
                  enable: true,
                  speed: 1,
                  direction: "bottom",
                  straight: false,
                  outModes: { default: "out" }
                },
                shape: { type: "polygon", polygon: { nb_sides: 5 } },
                life: { duration: { sync: false, value: 10 }, count: 1 },
                rotate: { value: 45, animation: { enable: true, speed: 5, sync: false } }
              }
            },
            {
              position: { x: 90, y: 0 },
              rate: { quantity: 1, delay: 3 },
              particles: {
                number: { value: 1 },
                color: { value: "#8B4513" },
                opacity: { value: 0.8 },
                size: { value: { min: 4, max: 6 } },
                move: {
                  enable: true,
                  speed: 1,
                  direction: "bottom",
                  straight: false,
                  outModes: { bottom: "none", default: "out" }
                },
                shape: { type: "polygon", polygon: { nb_sides: 5 } },
                life: { duration: { sync: false, value: 10 }, count: 1 },
                rotate: { value: 45, animation: { enable: true, speed: 5, sync: false } }
              }
            }
          ],
          detectRetina: true,
          background: { color: "transparent" }
        }}
      />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <GamemodesSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
