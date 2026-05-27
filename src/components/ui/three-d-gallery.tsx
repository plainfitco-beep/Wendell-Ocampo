import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  RotateCw, 
  Layers, 
  Sliders, 
  Maximize, 
  Flame, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Sparkles, 
  Crosshair, 
  Hourglass, 
  Info, 
  ChevronRight, 
  Image as ImageIcon, 
  Tv, 
  Camera, 
  ArrowLeft,
  Cpu,
  Monitor,
  Zap,
  Check,
  Eye,
  Settings
} from 'lucide-react';

// Import D5 Rendered assets created earlier
import monolithD5Url from "@/assets/images/monolith_d5_1779719912744.png";
import japandiSancD5Url from "@/assets/images/japandi_sanc_d5_1779719932280.png";
import spatioModularD5Url from "@/assets/images/spatio_modular_d5_1779719948601.png";
import parametricFluidD5Url from "@/assets/images/parametric_fluid_d5_1779719968760.png";
import terrazzoKitchenD5Url from "@/assets/images/terrazzo_kitchen_d5_1779719982667.png";
import soundSphereD5Url from "@/assets/images/sound_sphere_d5_1779720001360.png";

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  resolution: string;
  engine: string;
  fov: string;
  exposure: string;
  contrast: string;
  renderTime: string;
  scaleFactor: string;
  gridCells: string;
  dateAdded: string;
}

const GALLERY_ITEMS: ShowcaseItem[] = [
  {
    id: 'spatio-modular',
    title: 'Spatio Modular Living',
    category: 'Architectural / Urbanism',
    description: 'A futuristic luxury modular high-rise tower featuring stacked residential blocks, private garden balconies, and floor-to-ceiling glass panel facades under a vibrant clear sky. Rendered in real-time D5.',
    imageUrl: spatioModularD5Url,
    resolution: '4K Rendering (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '24mm Wide-Angle',
    exposure: 'EV +1.2',
    contrast: 'Strong Contrast preset',
    renderTime: '1.2 minutes (RTX 4090)',
    scaleFactor: '1:100 Structural Scale',
    gridCells: '12x30 Modular Grid',
    dateAdded: '2026-05-25',
  },
  {
    id: 'monolith-brutalist',
    title: 'The Brutalist Monolith',
    category: 'Architectural / Landscape',
    description: 'A structural residential villa carved directly from mountainside textured light concrete. Captured under cold foggy sunrise light conditions.',
    imageUrl: monolithD5Url,
    resolution: '4K Rendering (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '35mm Cinematic Lens',
    exposure: 'EV -0.4',
    contrast: 'Moody Desaturated preset',
    renderTime: '2.4 minutes (RTX 4090)',
    scaleFactor: '1:50 Landscape Scale',
    gridCells: '8x16 In-situ Masonry',
    dateAdded: '2026-04-12',
  },
  {
    id: 'japandi-sanctuary',
    title: 'Japandi Sanctuary Common',
    category: 'Interior Design',
    description: 'A harmonious blend of Japanese minimalism and Scandinavian warmth featuring white-oak wood profiles, textured linen, and filtered daylight propagation shadows.',
    imageUrl: japandiSancD5Url,
    resolution: '4K Rendering (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '24mm Tilt-Shift Lens',
    exposure: 'EV +0.8',
    contrast: 'Soft Ambient preset',
    renderTime: '45 seconds (RTX 4090)',
    scaleFactor: '1:1 Space Scale',
    gridCells: '10x12 Lighting Path',
    dateAdded: '2026-05-01',
  },
  {
    id: 'parametric-pavilion',
    title: 'Parametric Fluid Pavilion',
    category: 'Architectural / Shell Structure',
    description: 'A dynamic cultural centre pavilion with fiberglass curved shells and water mirror surfaces casting golden hour light caustic reflections on concrete.',
    imageUrl: parametricFluidD5Url,
    resolution: '4K Rendering (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '18mm Ultra-Wide Lens',
    exposure: 'EV +0.2',
    contrast: 'Sunset Warmth preset',
    renderTime: '1.8 minutes (RTX 4090)',
    scaleFactor: '1:200 Urban Scale',
    gridCells: '45x45 Spine Curvature',
    dateAdded: '2026-05-15',
  },
  {
    id: 'terrazzo-kitchen',
    title: 'Minimalist Terrazzo Laboratory',
    category: 'Luxury Interior Space',
    description: 'Moody dark concrete kitchen island incorporating bespoke custom marble aggregate terrazzo counters and soft embedded brass illumination strips.',
    imageUrl: terrazzoKitchenD5Url,
    resolution: '4K Rendering (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '28mm Standard Focal',
    exposure: 'EV +0.0',
    contrast: 'High-Contrast Matte',
    renderTime: '55 seconds (RTX 4090)',
    scaleFactor: '1:1 Space Scale',
    gridCells: '8x16 Tile Mesh',
    dateAdded: '2026-05-10',
  },
  {
    id: 'sound-sphere',
    title: 'Solfeggio Sound Sphere',
    category: 'Industrial Product Design',
    description: 'An architectural table accessory with dual-chamber sonic sound modules, wrapped in acoustically transparent polymer meshes.',
    imageUrl: soundSphereD5Url,
    resolution: '4K Studio Macro (3840x2160)',
    engine: 'D5 Render v3.8 Pro',
    fov: '85mm Portrait Macro',
    exposure: 'EV +0.5',
    contrast: 'Clean Studio lighting',
    renderTime: '35 seconds (RTX 4090)',
    scaleFactor: '5:1 Component Scale',
    gridCells: 'Mesh Geometry Grid',
    dateAdded: '2026-05-20',
  }
];

// Aesthetic environment lighting modes
interface LightingPreset {
  id: string;
  name: string;
  color: string;
  overlayClass: string;
  temperature: string;
  intensity: string;
  icon: React.ReactNode;
}

export function ThreeDGalleryPage({ onBack }: { onBack: () => void }) {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem>(GALLERY_ITEMS[0]);
  
  // Interactive 3D spatial positioning
  const [rotateX, setRotateX] = useState<number>(-12);
  const [rotateY, setRotateY] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showMetadataHud, setShowMetadataHud] = useState<boolean>(true);
  const [selectedLighting, setSelectedLighting] = useState<string>('morning');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  
  // Interactive virtual soundscapes
  const [soundscape, setSoundscape] = useState<'none' | 'ambient' | 'lounge' | 'cyber'>('none');
  const [audioOscillator, setAudioOscillator] = useState<number[]>([12, 24, 18, 45, 30, 15, 20]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotation effect
  useEffect(() => {
    let timer: any;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotateY(prev => (prev + 0.15) % 360);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [autoRotate]);

  // Audio frequency oscillator simulation block
  useEffect(() => {
    let audioTimer: any;
    if (soundscape !== 'none') {
      audioTimer = setInterval(() => {
        setAudioOscillator(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 45) + 10)
        );
      }, 150);
    }
    return () => clearInterval(audioTimer);
  }, [soundscape]);

  // Handle drag/pan interaction to rotate canvas in 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Disable manual rotate tracking to avoid jittering if auto-rotate is on,
    // or let mouse hover tilt the container
    if (autoRotate) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Scale down movement to reasonable angles
    setRotateY((x / (width / 2)) * 30);
    setRotateX(-(y / (height / 2)) * 30);
  };

  const resetViewport = () => {
    setRotateX(-12);
    setRotateY(15);
    setZoom(1);
    setAutoRotate(false);
  };

  const LIGHTING_PRESETS: LightingPreset[] = [
    { 
      id: 'morning', 
      name: 'Foggy Sunrise', 
      color: 'from-orange-500/10 via-transparent to-sky-950/20', 
      overlayClass: 'mix-blend-color-dodge bg-gradient-to-tr from-orange-400/20 via-neutral-900/10 to-transparent',
      temperature: '4800K', 
      intensity: '85 lm',
      icon: <Sun className="w-4 h-4 text-orange-400" />
    },
    { 
      id: 'noon', 
      name: 'High Noon', 
      color: 'from-white/5 via-transparent to-transparent', 
      overlayClass: 'mix-blend-overlay bg-gradient-to-b from-white/10 via-transparent to-white/5',
      temperature: '6500K', 
      intensity: '120 lm',
      icon: <Sun className="w-4 h-4 text-amber-100" />
    },
    { 
      id: 'cyber', 
      name: 'Neon Cyberpunk', 
      color: 'from-purple-500/10 via-pink-500/5 to-cyan-500/20', 
      overlayClass: 'mix-blend-color-dodge bg-gradient-to-br from-purple-800/35 via-pink-700/15 to-cyan-400/20',
      temperature: '12000K', 
      intensity: '140 lm',
      icon: <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
    },
    { 
      id: 'dusk', 
      name: 'Sunset Glow', 
      color: 'from-amber-600/15 via-rose-500/5 to-neutral-950/40', 
      overlayClass: 'mix-blend-color bg-gradient-to-t from-orange-600/30 via-rose-500/5 to-transparent',
      temperature: '3200K', 
      intensity: '65 lm',
      icon: <Moon className="w-4 h-4 text-rose-400" />
    }
  ];

  const currentPreset = LIGHTING_PRESETS.find(p => p.id === selectedLighting) || LIGHTING_PRESETS[0];

  return (
    <div id="three-d-showroom-page" className="w-full min-h-screen bg-neutral-950 text-white flex flex-col items-center relative overflow-hidden font-sans">
      
      {/* 3D Grid Backdrop Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Controls Header */}
      <header className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4 relative z-40 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer inline-flex items-center gap-2 group text-xs md:text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Portfolio</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full font-mono">
            <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>WebGL Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-300">Live 3D Showroom</span>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage Grid */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        
        {/* Left Interactive 3D Canvas Box - 7 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main 3D Canvas Container */}
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="w-full h-[360px] sm:h-[450px] md:h-[520px] rounded-[32px] border border-white/10 bg-[#070707] relative overflow-hidden flex items-center justify-center cursor-move"
          >
            {/* Background Render Lighting Atmosphere Layer */}
            <div className={`absolute inset-0 bg-gradient-to-b ${currentPreset.color} transition-all duration-1000 z-0 pointer-events-none`} />

            {/* Corner HUD framing tags */}
            <div className="absolute top-6 left-6 z-30 font-mono text-[9px] text-neutral-400 tracking-wider flex flex-col gap-1 select-none">
              <span className="flex items-center gap-1.5"><Crosshair className="size-3 text-neutral-500" /> MATRIX COORD: X{rotateX.toFixed(1)}° / Y{rotateY.toFixed(1)}°</span>
              <span>RENDER ENGINE: D5 RENDER v3.8 PRO</span>
              <span>STATE: SHADER PROJECTION</span>
            </div>

            <div className="absolute top-6 right-6 z-30 font-mono text-[9px] text-neutral-400 tracking-wider flex flex-col items-end gap-1 select-none">
              <span className="flex items-center gap-1"><Monitor className="size-3" /> PERSPECTIVE CAMERA</span>
              <span>ZOOM: {(zoom * 100).toFixed(0)}%</span>
              <span className="text-emerald-500">STABLE FRAME RATE: 60 FPS</span>
            </div>

            {/* Real 3D Transform Object Frame */}
            <div 
              className="relative w-full h-full flex items-center justify-center z-10 p-8"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  scale: zoom
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: autoRotate ? 40 : 25,
                  mass: 0.8
                }}
                className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/15 bg-neutral-900 group"
              >
                {/* Simulated Grid Depth Backdrop inside the 3D element */}
                <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover select-none transition-all duration-1000 pointer-events-none z-10 ${
                    isWireframe ? 'opacity-25 filter invert scale-[1.01]' : 'opacity-100'
                  }`}
                />

                {/* Wireframe blueprint grid mask layer to simulate technical blueprint overlay */}
                {isWireframe && (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,250,255,0.15)_2px,transparent_2px),linear-gradient(to_bottom,rgba(0,250,255,0.15)_2px,transparent_2px)] bg-[size:16px_16px] z-20 mix-blend-color-dodge animate-pulse-slow">
                    {/* Floating HUD numbers */}
                    <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[#00FAFF]">
                      VECTOR MESH: COMPILING TRIS... {selectedItem.gridCells}
                    </div>
                  </div>
                )}

                {/* Custom D5 Lighting Overlay Layer to project sunset dusk / morning / cyber colors onto the rendering */}
                <div className={`absolute inset-0 ${currentPreset.overlayClass} mix-blend-color transition-all duration-1000 z-15 pointer-events-none`} />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent z-15 pointer-events-none" />
                
                {/* Focal node lines */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-500/30 border-dashed" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-500/30 border-dashed" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-red-500/40 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Virtual Pedestal Grid shadow below the card */}
              <div 
                className="absolute bottom-12 w-[65%] h-8 bg-black/75 rounded-full blur-xl pointer-events-none z-0 transform transition-all"
                style={{ 
                  transform: `rotateX(90deg) translateZ(-80px) scale(${zoom})`,
                  opacity: 0.6 - (Math.abs(rotateX) / 100)
                }}
              />
            </div>

            {/* Bottom Floating Visualizer Tool Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/80 border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-2xl">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-full cursor-pointer transition-colors ${autoRotate ? 'bg-white text-black' : 'hover:bg-white/10 text-neutral-400 hover:text-white'}`}
                title="Toggle Auto Orbit Rotation"
              >
                <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
              </button>
              
              <div className="w-[1px] h-4 bg-white/20 mx-1" />
              
              <button
                type="button"
                onClick={() => setIsWireframe(!isWireframe)}
                className={`px-3 py-1 text-xs rounded-full font-mono cursor-pointer transition-colors ${isWireframe ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                Wireframe
              </button>

              <button
                type="button"
                onClick={() => setShowMetadataHud(!showMetadataHud)}
                className={`px-3 py-1 text-xs rounded-full font-mono cursor-pointer transition-colors ${showMetadataHud ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                HUD Specs
              </button>

              <div className="w-[1px] h-4 bg-white/20 mx-1" />

              <button
                type="button"
                onClick={resetViewport}
                className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
                title="Reset View Angle"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Cinematic Soundtrack Desk */}
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-neutral-300">
                {soundscape === 'none' ? <VolumeX className="w-5 h-5 text-neutral-500" /> : <Volume2 className="w-5 h-5 text-emerald-400 animate-bounce" />}
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-neutral-500 tracking-wider">Spatial Foley Simulation</span>
                <h4 className="text-sm font-semibold text-white">Interactive Gallery Soundscape</h4>
              </div>
            </div>

            {/* Simulated Live Equalizer Waveform Lines */}
            <div className="flex items-end gap-1.5 h-8 px-4 select-none">
              {audioOscillator.map((height, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: soundscape === 'none' ? 3 : height }}
                  className={`w-1 rounded-full ${soundscape === 'none' ? 'bg-neutral-800' : 'bg-gradient-to-t from-emerald-500 to-teal-400'}`}
                  style={{ minHeight: '3px' }}
                />
              ))}
            </div>

            {/* Selectable Sound Themes */}
            <div className="flex items-center gap-2">
              {(['none', 'ambient', 'cyber'] as const).map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => {
                    setSoundscape(track);
                    if (track === 'none') {
                      setAudioOscillator([3, 3, 3, 3, 3, 3, 3, 3]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono border cursor-pointer transition-all uppercase ${
                    soundscape === track 
                      ? 'bg-neutral-100 text-black border-white font-semibold' 
                      : 'bg-transparent text-neutral-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Project Sidebar Details Panel - 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Active Material specifications HUD */}
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
            
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-bold text-neutral-500">
                ACTIVE PROJECT SPEC SHEET
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-2 font-display">
                {selectedItem.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light mt-3 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Diagnostic Parameters list */}
            {showMetadataHud && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Sliders className="size-3.5 text-neutral-400" /> Resolution</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.resolution}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Camera className="size-3.5 text-neutral-400" /> Focal Segment</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.fov}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Sun className="size-3.5 text-neutral-400" /> Exposure (EV)</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.exposure}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Cpu className="size-3.5 text-neutral-400" /> Engine Specs</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.engine}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Hourglass className="size-3.5 text-neutral-400" /> Render Trace Time</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.renderTime}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5"><Layers className="size-3.5 text-neutral-400" /> Mesh Layout</span>
                  <span className="text-xs font-mono text-white text-right font-medium">{selectedItem.gridCells}</span>
                </div>
              </div>
            )}

            {/* Atmospheric Lighting Preset Picker */}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                D5 Atmosphere Presets
              </span>

              <div className="grid grid-cols-2 gap-2">
                {LIGHTING_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedLighting(p.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedLighting === p.id 
                        ? 'bg-white/10 border-white/30 text-white' 
                        : 'bg-transparent border-white/5 hover:border-white/15 text-neutral-400'
                    }`}
                  >
                    {p.icon}
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold">{p.name}</span>
                      <span className="text-[8px] font-mono opacity-60">{p.temperature}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Render Camera Angle Preset Block */}
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-3">
            <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-white" />
              Quick Orbit Controls
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => { setRotateX(-10); setRotateY(30); setAutoRotate(false); }}
                className="py-1.5 px-3 bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 rounded-lg text-xs font-mono cursor-pointer transition-colors"
              >
                Angular View
              </button>
              <button 
                type="button"
                onClick={() => { setRotateX(0); setRotateY(0); setAutoRotate(false); }}
                className="py-1.5 px-3 bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 rounded-lg text-xs font-mono cursor-pointer transition-colors"
              >
                Flat Isometric
              </button>
              <button 
                type="button"
                onClick={() => { setRotateX(-30); setRotateY(120); setAutoRotate(false); }}
                className="py-1.5 px-3 bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 rounded-lg text-xs font-mono cursor-pointer transition-colors"
              >
                High Perspective
              </button>
              <button 
                type="button"
                onClick={() => { setRotateX(12); setRotateY(210); setAutoRotate(false); }}
                className="py-1.5 px-3 bg-neutral-900 border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 rounded-lg text-xs font-mono cursor-pointer transition-colors"
              >
                Ground Level
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Works Horizontal Ribbon */}
      <section className="w-full bg-neutral-950 border-t border-white/5 py-8 relative z-30">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-3.5 h-3.5 text-white rotate-180" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Switch Showroom Assets ({GALLERY_ITEMS.length})
            </span>
          </div>
          
          <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pb-4">
            {GALLERY_ITEMS.map((item) => {
              const isActive = item.id === selectedItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                    // Add micro-shudder interaction
                    setIsWireframe(false);
                  }}
                  className={`flex-none w-[200px] text-left rounded-2xl p-3 border cursor-pointer group transition-all duration-300 relative ${
                    isActive 
                      ? 'bg-neutral-900 border-white/30 shadow-[0_4px_24px_rgba(255,255,255,0.05)]' 
                      : 'bg-[#0f0f0f]/50 border-white/5 hover:border-white/20 hover:bg-[#151515]'
                  }`}
                >
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-3 bg-neutral-800 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Tiny Check indicator */}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                        <Check className="size-3 stroke-[3px]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs text-neutral-300 font-semibold truncate group-hover:text-white transition-colors">{item.title}</h5>
                    <span className="text-[10px] text-neutral-500 font-mono block mt-1">{item.fov}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
