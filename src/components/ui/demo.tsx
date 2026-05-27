'use client'

import React, { useState } from "react";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import bgImageUrl from "@/assets/images/living_room_bg.png";
 
export function SplineSceneBasic() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const existing = localStorage.getItem('wendell_signups');
      const list = existing ? JSON.parse(existing) : [];
      list.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('wendell_signups', JSON.stringify(list));

      // Post registration to backend server
      const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      await fetch(`${API_BASE}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      setStatus('success');
      setEmail('');
    } catch (err) {
      console.warn("Backend subscriber registration failed, saved locally", err);
      // Fallback gracefully for pure static preview support
      setStatus('success');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[700px] md:min-h-[600px] md:h-[600px] relative overflow-hidden flex flex-col md:flex-row rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl shadow-white/5">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Blended luxury background container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img 
          src={bgImageUrl} 
          alt="Atmospheric Living Room Background" 
          className="w-full h-full object-cover opacity-[0.68] filter saturate-[0.8] brightness-[0.82] contrast-[1.1]"
          referrerPolicy="no-referrer"
        />
        {/* Soft elegant gradient overlays to blend text readability on the left and spline scene on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-neutral-950/95 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
      </div>
      
      <div className="flex flex-col md:flex-row w-full flex-1 relative z-10">
        {/* Left content */}
        <div className="flex-none md:flex-1 p-8 pt-12 pb-4 md:p-16 md:pt-16 md:pb-16 relative z-10 flex flex-col justify-center items-center text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            3D Designer Portfolio
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 tracking-tight leading-[1.15]"
          >
            Spatial <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-white">Visualizations</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-neutral-400 max-w-[280px] sm:max-w-[320px] md:max-w-xl text-[15px] md:text-lg leading-relaxed font-light font-sans"
          >
            I specialize in high-fidelity 3D visualization across architecture, interior design, product rendering, and landscape concept modeling. Combining cinematic spatial fidelity with fully interactive digital canvas controls.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-8 w-full max-w-sm"
          >
            {status === 'success' ? (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>You're subscribed for custom 3D design releases! 🚀</span>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to get 3D design releases & updates"
                  className="px-4 py-2.5 bg-black/40 rounded-full border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors flex-1 w-full"
                  required
                />
                <button 
                  type="submit" 
                  className="whitespace-nowrap px-6 py-2.5 text-sm font-semibold text-black bg-white rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Join List <ArrowRight className="size-3.5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[250px] sm:min-h-[300px] md:min-h-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none md:hidden" />
          <SplineScene 
            scene="https://my.spline.design/nexbotrobotcharacterconcept-2AFxm8VvQixNVmrLv1RGxa4G/"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
