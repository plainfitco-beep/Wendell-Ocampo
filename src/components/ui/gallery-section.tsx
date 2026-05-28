import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  X, 
  Layers, 
  Camera, 
  Cpu, 
  Eye, 
  FileImage
} from 'lucide-react';
import monolithD5Url from "@/assets/images/brutalist_monolith.png";
import japandiSancD5Url from "@/assets/images/japandi_sanctuary.png";
import spatioModularD5Url from "@/assets/images/spatio_modular_living.png";
import parametricFluidD5Url from "@/assets/images/parametric_fluid_pavilion.png";
import terrazzoKitchenD5Url from "@/assets/images/terrazzo_kitchen.png";
import soundSphereD5Url from "@/assets/images/sound_sphere.png";
import spatioTowerRenderUrl from "@/assets/images/spatio_tower_render.png";
import luminousTimepieceD5Url from "@/assets/images/luminous_timepiece.png";

interface GalleryItem {
  id: string;
  title: string;
  category: 'Architectural' | 'Interior' | 'Product Design' | 'Marketing Videos';
  description: string;
  imageUrl: string;
  resolution: string;
  dateAdded: string;
}

const PRESEEDED_ITEMS: GalleryItem[] = [
  {
    id: 'arch-1',
    title: 'The Brutalist Monolith',
    category: 'Architectural',
    description: 'A structural residential villa carved directly from mountainside textured light concrete. Captured under cold foggy sunrise light conditions.',
    imageUrl: monolithD5Url,
    resolution: 'Exterior 3D Vista',
    dateAdded: '2026-04-12',
  },
  {
    id: 'video-1',
    title: 'The Spatio Tower Cinematic Walkthrough',
    category: 'Marketing Videos',
    description: 'A 60-second high-impact promotional walkthrough and kinetic camera sequence showcasing structural stacking, vertical gardens, and golden hour reflections.',
    imageUrl: spatioTowerRenderUrl,
    resolution: 'Motion Production Showcase',
    dateAdded: '2026-05-24',
  },
  {
    id: 'interior-1',
    title: 'Japandi Sanctuary Common',
    category: 'Interior',
    description: 'A harmonious blend of Japanese minimalism and Scandinavian warmth featuring white-oak wood profiles, textured linen, and filtered daylight propagation shadows.',
    imageUrl: japandiSancD5Url,
    resolution: 'Spatial Interior View',
    dateAdded: '2026-05-01',
  },
  {
    id: 'product-1',
    title: 'Spatio Modular Living',
    category: 'Architectural',
    description: 'A futuristic luxury modular high-rise tower featuring stacked residential blocks, private garden balconies, and floor-to-ceiling glass panel facades under a vibrant clear sky.',
    imageUrl: spatioModularD5Url,
    resolution: 'Modular 3D Space',
    dateAdded: '2026-05-25',
  },
  {
    id: 'arch-2',
    title: 'Parametric Fluid Pavilion',
    category: 'Architectural',
    description: 'A dynamic cultural centre pavilion with fiberglass curved shells and water mirror surfaces casting golden hour light caustic reflections on concrete.',
    imageUrl: parametricFluidD5Url,
    resolution: 'Fluid Pavilion Study',
    dateAdded: '2026-05-15',
  },
  {
    id: 'interior-2',
    title: 'Minimalist Terrazzo Laboratory',
    category: 'Interior',
    description: 'Moody dark concrete kitchen island incorporating bespoke custom marble aggregate terrazzo counters and soft embedded brass illumination strips.',
    imageUrl: terrazzoKitchenD5Url,
    resolution: 'Tactile Close-up',
    dateAdded: '2026-05-10',
  },
  {
    id: 'product-2',
    title: 'Helios Luminous Timepiece',
    category: 'Product Design',
    description: 'A luxury home companion featuring a glass projection ring floating magnetically above a round absolute-black granite base. Soft volumetric golden light emits from the inner rim.',
    imageUrl: luminousTimepieceD5Url,
    resolution: 'Macro Product Detail',
    dateAdded: '2026-05-20',
  },
  {
    id: 'video-2',
    title: 'Helios Luminous Timepiece Commercial Reel',
    category: 'Marketing Videos',
    description: 'A bespoke premium cinematic advertisement detailing the precision magnetic levitation mechanism, gold-plated internal induction coil layers, and soft-glowing volumetric lighting.',
    imageUrl: luminousTimepieceD5Url,
    resolution: 'Commercial Interactive Video',
    dateAdded: '2026-05-26',
  }
];

export function GallerySection({ onEnterShowroom }: { onEnterShowroom?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Architectural' | 'Interior' | 'Product Design' | 'Marketing Videos'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Filter systems
  const filteredItems = PRESEEDED_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="works" className="pt-4 pb-16 md:pt-6 md:pb-24 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      
      <div className="mx-auto w-full max-w-6xl px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-white animate-pulse" />
            Interactive Spatial Portfolio
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl font-display text-center">
            The Render <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-neutral-500">Archive</span>
          </h2>
          <p className="text-neutral-400 mt-3 text-sm md:text-base tracking-wide max-w-2xl mx-auto font-light leading-relaxed text-center">
            A comprehensive, client-accessible gallery showcasing high-fidelity architectural rendering concepts, mid-century modern interior animations, and stunning interactive digital walkthrough walkthroughs.
          </p>

          {onEnterShowroom && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterShowroom}
              className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] cursor-pointer group text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-black animate-pulse" />
              <span>Launch Virtual 3D Showroom Page</span>
              <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px] ml-1 group-hover:translate-x-0.5 transition-transform font-mono">→</span>
            </motion.button>
          )}
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Quick Filters */}
          <div className="lg:col-span-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between w-full">
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              {(['All', 'Architectural', 'Interior', 'Product Design', 'Marketing Videos'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-white text-black font-semibold' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Filter Search Bar */}
            <div className="relative flex-1 md:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project, engine, style..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-white text-xs md:text-sm focus:outline-none focus:border-white/30 placeholder-neutral-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 size-4" />
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="lg:col-span-4 flex items-center justify-end gap-3 text-xs text-neutral-500 font-light border-l border-white/10 pl-6 h-full min-h-[44px]">
            <Layers className="size-4 text-neutral-400" />
            <span>Showing {filteredItems.length} spatial visualizations</span>
          </div>
        </div>

        {/* Gallery Interactive Loop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Actual Curated Items */}
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveItem(item)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] cursor-pointer min-h-[380px] flex flex-col hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500"
              >
                {/* Visual Cover Asset */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900 border-b border-white/10">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Category Tag Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white text-[10px] font-semibold backdrop-blur-md">
                    {item.category}
                  </div>

                  {/* Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Eye className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Info and Specs Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white tracking-tight">{item.title}</h4>
                    <p className="text-neutral-400 mt-2 text-xs md:text-sm font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Indicators */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <div className="flex items-center gap-1 font-sans text-[11px]">
                      <Camera className="size-3 text-neutral-400" />
                      <span>{item.resolution}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{item.dateAdded}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* LUXURY INSPECT LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-5xl rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Left Column: Huge Rendering */}
              <div className="md:col-span-7 relative bg-neutral-900 border-r border-white/10 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[400px] md:h-[550px]">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[550px]"
                />
                
                <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-black/75 border border-white/10 text-xs text-white font-medium backdrop-blur-md">
                  {activeItem.category}
                </div>
              </div>

              {/* Right Column: High Fidelity Technical Spec Sheets */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between h-full min-h-[400px] md:h-[550px]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 font-mono">
                      Visualization Spec Sheet
                    </span>
                    <button
                      onClick={() => setActiveItem(null)}
                      className="p-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white mt-4 font-display">
                    {activeItem.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm font-light mt-4 leading-relaxed">
                    {activeItem.description}
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
                      <span className="text-neutral-500 font-medium">Dimension Scope</span>
                      <span className="text-white font-mono font-semibold">{activeItem.resolution}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
                      <span className="text-neutral-500 font-medium">Primary Category</span>
                      <span className="text-white font-mono font-semibold">{activeItem.category}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
                      <span className="text-neutral-500 font-medium font-sans">Date Synthesized</span>
                      <span className="text-neutral-400 font-mono">{activeItem.dateAdded}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
                      <span className="text-neutral-500 font-medium font-sans">Color Space Calibration</span>
                      <span className="text-emerald-500 font-mono font-semibold">sRGB Linear Rec.709</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-3">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="flex-1 px-6 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-center text-white transition-all cursor-pointer"
                  >
                    Close Specs
                  </button>
                  <a
                    href={activeItem.imageUrl}
                    download={`${activeItem.title.replace(/\s+/g, '_')}_4K_Render.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold text-center transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <FileImage className="size-3.5" />
                    Download Render
                  </a>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
