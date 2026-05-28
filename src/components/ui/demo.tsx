import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

// Import real project rendering images for the Hero Carousel
import monolithD5Url from "@/assets/images/brutalist_monolith.png";
import japandiSancD5Url from "@/assets/images/japandi_sanctuary.png";
import spatioModularD5Url from "@/assets/images/spatio_modular_living.png";
import parametricFluidD5Url from "@/assets/images/parametric_fluid_pavilion.png";
import terrazzoKitchenD5Url from "@/assets/images/terrazzo_kitchen.png";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  specText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Brutalist Monolith Simulation",
    subtitle: "COLD DAWN METEOROLOGY FOG",
    description: "A structural residential oasis carved directly from rugged mountainside slabs, reflecting diffused morning lighting.",
    imageUrl: monolithD5Url,
    specText: "LOD 18.2M // RAYTRACED ATMOSPHERE"
  },
  {
    title: "Japandi Sanctuary Living",
    subtitle: "DOUBLE-BOUNCE INDIRECT PHOTONS",
    description: "An elegant blend of soft oak wood profiles and organic textures under warm, filtered sunlight filtration shadows.",
    imageUrl: japandiSancD5Url,
    specText: "sRGB RECA // SDF RAYMARCHING LIGHTMAP"
  },
  {
    title: "Spatio-Modular High-Rise",
    subtitle: "STYLIZED MODULAR ARCHITECTURE",
    description: "Stacked living clusters and private sky-garden terraces utilizing fully interactive floor-to-ceiling glass panel facades.",
    imageUrl: spatioModularD5Url,
    specText: "LOD 24.5M // DYNAMIC DAY LIGHT ANGLE"
  },
  {
    title: "Parametric Fluid Pavilion",
    subtitle: "CURVED SHAPE GLASS CAUSTICS",
    description: "A gorgeous cultural center structure highlighting fluid fiberglass curvatures and high-fidelity water surface ripples.",
    imageUrl: parametricFluidD5Url,
    specText: "32.0M POLYGONS // REFLECTION CAUSTICS"
  },
  {
    title: "Minimalist Terrazzo Kitchen",
    subtitle: "BESPOKE TACTILE CLOSE-UP STUDY",
    description: "Moody dark cement islands featuring custom marble aggregates and luxury warm embedded brass light strips.",
    imageUrl: terrazzoKitchenD5Url,
    specText: "4K TEXTURE BUFFER // EMISSIVE SHADERS"
  }
];

export function SplineSceneBasic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "success">(null);
  const [loading, setLoading] = useState(false);

  // Setup autoplay loop
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000); // Transitions slide every 6 seconds
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Local preservation
      const existing = localStorage.getItem("wendell_signups");
      const list = existing ? JSON.parse(existing) : [];
      list.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem("wendell_signups", JSON.stringify(list));

      // Attempt endpoint subscription save
      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.warn("Backend subscriber registration fell back to client preservation success", err);
    } finally {
      setLoading(false);
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <div className="w-full min-h-[550px] md:h-[620px] relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl group flex flex-col justify-end">
      
      {/* Background Slideshow with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0.1, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.1, scale: 0.98 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0 select-none"
          >
            <img
              src={HERO_SLIDES[currentIndex].imageUrl}
              alt={HERO_SLIDES[currentIndex].title}
              className="w-full h-full object-cover brightness-[0.65] contrast-[1.08] saturate-[0.85]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Overlay Design */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30 z-10" />
        
        {/* Abstract grid network lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 z-10 pointer-events-none" />
      </div>

      {/* Floating Interactive Controls (Left/Right Arrows & Indicators) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
        <span className="text-[10px] font-mono tracking-widest text-[#00FAFF]">
          0{currentIndex + 1} / 0{HERO_SLIDES.length}
        </span>
        <div className="h-3 w-px bg-white/10" />
        <button
          onClick={handlePrev}
          type="button"
          className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Previous Image Render"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={handleNext}
          type="button"
          className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Next Image Render"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Tech Border Frame corners overlay */}
      <div className="absolute inset-6 border border-white/5 pointer-events-none z-10 rounded-2xl flex flex-col justify-between p-4">
        <div className="flex justify-between items-start text-[8px] font-mono tracking-widest text-neutral-400/60 uppercase">
          <span>[SIMULATION STREAMING ACTIVE]</span>
          <span>SYS CAM CONTROLLER D5</span>
        </div>
        <div className="flex justify-between items-end text-[8px] font-mono tracking-widest text-[#00FAFF]/60 uppercase">
          <span>HUD RESOLUTION 4K_NATIVE</span>
          <span>STUDIO // WO INTERACTIVE</span>
        </div>
      </div>

      {/* Overlaid Main Content Grid (Bottom aligned for beautiful typography) */}
      <div className="w-full relative z-20 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full pt-24">
        
        {/* Left Info: Captions & Descriptions */}
        <div className="max-w-xl flex flex-col justify-end h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-neutral-300 text-[9px] font-mono uppercase tracking-widest">
                <Sparkles className="size-3 text-[#00FAFF] animate-pulse" />
                {HERO_SLIDES[currentIndex].subtitle}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
                {HERO_SLIDES[currentIndex].title}
              </h1>

              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                {HERO_SLIDES[currentIndex].description}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-[9px] text-[#00FAFF] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FAFF]" />
                {HERO_SLIDES[currentIndex].specText}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Info: Newsletter Signup overlay */}
        <div className="md:max-w-xs w-full bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-white tracking-widest text-center md:text-left uppercase">
              STUDIO RELEASES
            </h3>
            <p className="text-[10px] text-neutral-400 text-center md:text-left">
              Get direct alerts when we synthesize new 3D spatial environments.
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
            >
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>Subscribed successfully! 🚀</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-2 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@studio.com"
                className="px-3.5 py-2.5 bg-black/60 rounded-xl border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors w-full"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full text-xs font-bold text-black bg-white rounded-xl py-2.5 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span>{loading ? "Registering..." : "Access Pipelines"}</span>
                <ArrowRight className="size-3" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Progress Dots Bottom Control Panel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            title={`Go to Slide ${i + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
