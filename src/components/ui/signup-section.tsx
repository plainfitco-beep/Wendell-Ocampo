'use client';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Mail, Send, Sparkles, MessageSquare, User, FileText, ChevronRight } from 'lucide-react';

export function SignupSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("info@wendellocampo.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="signup" className="py-24 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      <div className="mx-auto w-full max-w-5xl px-4 relative z-10">
        <AnimatedContainer className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0c0c0e] via-neutral-950 to-black p-8 md:p-16 text-center shadow-2xl shadow-black/80">
          
          {/* Decorative visual circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

          {/* Icon Badge */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
            <Mail className="size-5 text-neutral-300" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl text-white font-display">
            Initiate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-500">3D Design</span>
          </h2>
          
          <p className="text-neutral-400 mt-4 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Submit your architectural vision, interior landscape, or custom product concept. Drop us a line directly to discuss secure pipeline renders and immersive virtual assets.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative z-30 flex flex-col items-center gap-6">
            {/* Direct Email Container */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.03] border border-white/10 p-2.5 pl-6 pr-3.5 rounded-full hover:border-white/20 transition-all duration-300 group">
              <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest select-none">Contact</span>
              <a 
                href="mailto:info@wendellocampo.com"
                className="text-white hover:text-neutral-200 font-mono text-sm md:text-base font-medium tracking-wide transition-colors"
              >
                info@wendellocampo.com
              </a>
              <div className="h-px w-8 sm:h-4 sm:w-px bg-white/10 my-1 sm:my-0" />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-white/5"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-black" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Mail className="size-3.5 text-black" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Action Link */}
            <a 
              href="mailto:info@wendellocampo.com" 
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group"
            >
              <span>Launch mail client directly</span>
              <ChevronRight className="size-3 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-neutral-500 font-light select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct private communication interface. Expect replies within 24 hours.</span>
          </div>

        </AnimatedContainer>
      </div>
    </section>
  );
}

type ViewAnimationProps = {
  className?: string;
  children: React.ReactNode;
};

function AnimatedContainer({ className, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(10px)', y: 30, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
