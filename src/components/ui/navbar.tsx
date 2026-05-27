import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from "@/assets/images/wo_logo_1779718689976.png";

export function Navbar({ 
  currentPage = 'home',
  onNavigate 
}: { 
  currentPage?: 'home' | 'gallery';
  onNavigate?: (page: 'home' | 'gallery') => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, item: string, href: string) => {
    setIsOpen(false);
    if (item === '3D Gallery') {
      e.preventDefault();
      if (onNavigate) {
        onNavigate('gallery');
      }
    } else if (item === 'Home') {
      e.preventDefault();
      if (onNavigate) {
        onNavigate('home');
      }
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else if (item === 'Contact') {
      e.preventDefault();
      if (onNavigate) {
        onNavigate('home');
      }
      setTimeout(() => {
        document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 ${scrolled ? 'top-2 md:top-4' : ''}`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Left: Logo */}
        <div 
          onClick={(e) => handleLinkClick(e, 'Home', '#')}
          className="flex items-center gap-3 pl-2 md:pl-0 cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 rounded-full overflow-hidden shadow-xl shadow-black/40 transition-transform duration-300 hover:scale-110">
            <img 
              src={logoUrl} 
              alt="WO Logo" 
              className="w-7 h-7 object-contain animate-pulse-slow"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-white font-bold tracking-wide text-lg font-display">
            Wendell Ocampo
          </span>
        </div>

        {/* Right: Links + CTA */}
        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            {[
              ['Home', '#', 'home'], 
              ['3D Gallery', '#works', 'gallery'], 
              ['Contact', '#signup', 'home']
            ].map(([item, href, pageKey]) => {
              const isActive = (pageKey === 'gallery' && currentPage === 'gallery') || (pageKey === 'home' && currentPage === 'home' && item !== 'Contact');
              return (
                <a 
                  key={item} 
                  href={href} 
                  className={`relative transition-colors group ${isActive ? 'text-white' : 'hover:text-white'}`}
                  onClick={(e) => handleLinkClick(e, item, href)}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-white transition-all duration-300 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              );
            })}
          </div>
          <button 
            onClick={(e) => handleLinkClick(e, 'Contact', '#signup')}
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
          >
            Sign Up
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-neutral-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full mt-2 p-4 rounded-3xl bg-black/80 border border-white/10 backdrop-blur-2xl flex flex-col gap-2 shadow-2xl overflow-hidden"
          >
            {[
              ['Home', '#'], 
              ['3D Gallery', '#works'], 
              ['Contact', '#signup']
            ].map(([item, href], i) => (
              <motion.a 
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                href={href} 
                onClick={(e) => handleLinkClick(e, item, href)}
                className="text-neutral-300 hover:text-white text-base font-medium transition-colors px-6 py-4 rounded-xl hover:bg-white/10"
              >
                {item}
              </motion.a>
            ))}
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={(e) => handleLinkClick(e, 'Contact', '#signup')}
              className="mt-2 mx-2 px-6 py-4 rounded-xl bg-white text-black text-base font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Sign Up
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
