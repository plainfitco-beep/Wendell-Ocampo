import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Layers, 
  Zap, 
  Sparkles, 
  Eye, 
  Sliders, 
  Activity, 
  Flame, 
  Monitor, 
  Check, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface VideoProject {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  techStack: string[];
  specs: {
    fps: string;
    vertices: string;
    shading: string;
    pipeline: string;
  };
  narrative: string;
  features: string[];
}

const PORTFOLIO_VIDEOS: VideoProject[] = [
  {
    id: "spatio-modular",
    title: "Spatio-Modular Enclosure Study",
    subtitle: "Interactive Architectural Visualization Loop",
    videoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7fdf1862cd22268939023c0f0af3a0cf0b6e15a1&profile_id=165&oauth2_token_id=57447761",
    techStack: ["WebGL Shaders", "Structured Concrete", "Atmospheric Occlusion"],
    specs: {
      fps: "60 FPS Native",
      vertices: "24.5M Polygons",
      shading: "Micro-depth Ambient Facade Occlusion",
      pipeline: "Custom Real-time WebGL Renderer"
    },
    narrative: "An analysis of stacked modular luxury living towers. The WebGL shader pipeline computes sunlight daylight reflections in real-time, adapting material warmth according to geographic solar coordinates.",
    features: [
      "Dynamic daytime solar angle solver",
      "Dynamic geometric lod (level-of-detail)",
      "High-contrast concrete texture maps"
    ]
  },
  {
    id: "brutalist-monolith",
    title: "Brutalist Monolith Dawn Simulation",
    subtitle: "Meteorological Fog and Landscape Rendering",
    videoUrl: "https://player.vimeo.com/external/435674681.sd.mp4?s=ec1a868f7b7cb372af4eef8cc3ad27c19958bc9e&profile_id=165&oauth2_token_id=57447761",
    techStack: ["Volumetric Fog", "Noise Perturbation", "Microparticle Scatters"],
    specs: {
      fps: "60 FPS Target",
      vertices: "18.2M Polygons",
      shading: "Raytraced Dawn Scattering",
      pipeline: "Custom Meteorological Grid Solver"
    },
    narrative: "Carved from textured dark mountainside slabs, this structural villa visualizes dynamic fog currents. An anisotropic wind vector solver shifts micro-particles and fog boundaries across the rugged stone architecture.",
    features: [
      "Procedural fog noise map",
      "Mountainside normal-map displacement",
      "Dynamic volumetric dawn rays"
    ]
  },
  {
    id: "japandi-sanctuary",
    title: "Japandi Sanctuary Common Rooms",
    subtitle: "Photon Bouncing & Light Occlusion Study",
    videoUrl: "https://player.vimeo.com/external/384761655.sd.mp4?s=382e213309a6ee0ddbb51b5e5fb231dfeb71f65d&profile_id=140&oauth2_token_id=57447761",
    techStack: ["Sunlight Propagation", "Japandi Aesthetics", "Texel Shadows"],
    specs: {
      fps: "60 FPS Stable",
      vertices: "12.0M Polygons",
      shading: "Double-bounce Global Illumination",
      pipeline: "SDF Raymarched Lightmaps"
    },
    narrative: "A warm minimalist residential interior highlighting sunlight filtration. Evaluates soft oak profiling and linen grain texture reflections as ambient light bounces through high-angle screens.",
    features: [
      "Anisotropic wood fiber reflection model",
      "Real-time daytime sun coordinates",
      "Soft daylight ray attenuation"
    ]
  },
  {
    id: "parametric-pavilion",
    title: "Parametric Fluid Center Study",
    subtitle: "Caustics Simulation & Composite Double Shells",
    videoUrl: "https://player.vimeo.com/external/406023773.sd.mp4?s=12ccbcf476906bf203e04e0e22bda4458d0421e6&profile_id=165&oauth2_token_id=57447761",
    techStack: ["Composite Wave Solvers", "Caustics Mapping", "Curved Shell Lod"],
    specs: {
      fps: "60 FPS Native",
      vertices: "32.0M Polygons",
      shading: "Real-time Reflection Caustics",
      pipeline: "Interactive Composite Math Engine"
    },
    narrative: "Dynamic wave solver reflecting caustics onto double-curved fiberglass structures. The water mirrors dynamically respond to synthetic wind frequencies and camera perspective updates.",
    features: [
      "Dynamic wave height perturbation",
      "Adaptive tessellation for double curvature",
      "Interactive refraction ray cascades"
    ]
  },
  {
    id: "sound-sphere",
    title: "Acoustic Resonance Sphere Portal",
    subtitle: "Interactive Material Micro-Deformation",
    videoUrl: "https://player.vimeo.com/external/517602058.sd.mp4?s=0fcbca6b41cb91bc8dca3fb6ff9bdbaaa7a62cfc&profile_id=164&oauth2_token_id=57447761",
    techStack: ["FFT Displacement", "Metallic Anisotropy", "Orbit Physics"],
    specs: {
      fps: "60 FPS Fluid",
      vertices: "8.4M Polygons",
      shading: "Iridescent Chrome Anisotropy",
      pipeline: "Audio Frequency Displacement Shader"
    },
    narrative: "Visualizing harmonic micro-depth sound deformations on an anisotropic reflective sphere shell. Displacement amplitudes vary dynamically according to synthetic acoustic feeds.",
    features: [
      "Micro-displacement noise feedback loop",
      "Iridescent physical materials (fresnel)",
      "Dynamic metallic grain reflection vectors"
    ]
  }
];

export function PortfolioPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeProject = PORTFOLIO_VIDEOS[activeIndex];

  // Sync state with active project change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Video play interrupted", err));
      }
    }
  }, [activeIndex]);

  // Handle Autoplay carousel progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, 12000); // Transitions video every 12 seconds
    }
    return () => clearInterval(interval);
  }, [activeIndex, isPlaying]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PORTFOLIO_VIDEOS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PORTFOLIO_VIDEOS.length) % PORTFOLIO_VIDEOS.length);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      triggerNotification(!isMuted ? "Audio Unmuted" : "Audio Muted");
    }
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        triggerNotification("Exit Window Fullscreen");
      } else {
        containerRef.current.requestFullscreen().then(() => {
          triggerNotification("Enter Native Fullscreen");
        }).catch(err => {
          console.error("Fullscreen failed:", err);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoRef.current.currentTime = percentage * duration;
      setCurrentTime(percentage * duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative z-10" id="portfolio-container">
      
      {/* Absolute floating HUD notices override */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900/90 border border-white/20 backdrop-blur-md shadow-2xl text-[10px] font-mono tracking-widest text-[#00FAFF] uppercase"
          >
            HUD WARNING: {showNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header telemetry area */}
      <div className="max-w-7xl mx-auto mb-12 text-center md:text-left mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]"
        >
          <Activity className="size-3 text-[#00FAFF] animate-pulse" />
          <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            PROJECT ENGINE VIEW PORT // HIGH FIDELITY VIDEO INTERACTIVE CAROUSEL
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-display text-white">
              Motion & Cinematics
            </h1>
            <p className="mt-3 text-neutral-400 text-sm md:text-base max-w-2xl font-light">
              Interactive 3D real-time visualizers, meteorology shaders, and raytraced caustics simulated directly under standard high-fidelity WebGL guidelines.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6 justify-center md:justify-end"
          >
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] font-mono text-neutral-500 tracking-widest uppercase">PIPELINE HUD</span>
              <span className="text-xs text-white font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/10 mt-1 inline-block">
                SYS_ONLINE // WEBGLE_V2
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Main Video Stage */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Wide Screen Viewport Area */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <motion.div 
              ref={containerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl shadow-black/80 group"
              id="portfolio-video-stage-frame"
            >
              {/* Actual HTML5 Video component */}
              <video
                ref={videoRef}
                src={activeProject.videoUrl}
                loop
                autoPlay
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover select-none pointer-events-none"
                preload="auto"
              />

              {/* Edge Gradient Ambient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-90 transition-opacity pointer-events-none" />

              {/* Subtle tech border overlay inside video */}
              <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none flex flex-col justify-between p-4 select-none">
                {/* Upper corners indicators */}
                <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
                  <span>[REC_STREAMING]</span>
                  <span>CAM_RENDER_D5</span>
                </div>
                {/* Lower corners indicators */}
                <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
                  <span>RESOLUTION 1080P</span>
                  <span>W. OCAMPO SYS</span>
                </div>
              </div>

              {/* Central Large Play State Trigger Overlay */}
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all transform scale-90 group-hover:scale-100 shadow-xl">
                  {isPlaying ? <Pause className="size-6 text-white" /> : <Play className="size-6 text-white ml-1" />}
                </div>
              </div>

              {/* Video Bottom Floating Interactive HUD Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col gap-3">
                
                {/* Custom Seek Timeline Bar */}
                <div 
                  onClick={handleProgressBarClick}
                  className="w-full h-1 bg-white/10 hover:h-2 rounded-full overflow-hidden cursor-pointer transition-all relative group/seek"
                  id="seek-bar-track"
                >
                  <div 
                    className="h-full bg-white relative transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover/seek:opacity-100" />
                  </div>
                </div>

                {/* Sub-bar buttons triggers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play Button Trigger */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={isPlaying ? "Pause Video State" : "Play Video State"}
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </button>

                    {/* Left/Right Arrow Carousel Triggers */}
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Previous Video Project"
                      >
                        <ChevronLeft className="size-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Next Video Project"
                      >
                        <ChevronRight className="size-4.5" />
                      </button>
                    </div>

                    {/* Timer */}
                    <span className="text-[10px] font-mono text-neutral-400 select-none">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Audio Toggle */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isMuted ? <VolumeX className="size-4 text-neutral-400" /> : <Volume2 className="size-4 text-[#00FAFF]" />}
                    </button>

                    {/* Native Fullscreen Trigger */}
                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Fullscreen Focus View"
                    >
                      <Maximize className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Carousel Thumbnails Strip underneath */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-5 gap-2.5 sm:gap-4 mt-2"
              id="portfolio-thumbnails-container"
            >
              {PORTFOLIO_VIDEOS.map((project, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={project.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative aspect-video rounded-xl overflow-hidden border bg-neutral-900 transition-all cursor-pointer ${
                      isActive 
                        ? 'border-[#00FAFF] ring-2 ring-[#00FAFF]/20 scale-[0.98]' 
                        : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'
                    }`}
                    title={project.title}
                  >
                    {/* Miniature video previews or stylized background covers */}
                    <video
                      src={project.videoUrl}
                      muted
                      preload="auto"
                      className="w-full h-full object-cover opacity-60 absolute inset-0 pointer-events-none"
                    />
                    <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-[#00FAFF]/10' : 'bg-black/40 group-hover:bg-black/10'}`} />
                    
                    {/* Index display */}
                    <span className="absolute bottom-1 right-2 text-[8px] sm:text-[9px] font-mono text-white/60">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Block: Telemetry details and narrative */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div 
              key={activeProject.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex flex-col gap-6 shadow-xl"
              id="portfolio-telemetry-hud"
            >
              {/* Floating ID badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#00FAFF] tracking-widest uppercase bg-[#00FAFF]/5 px-2.5 py-1 rounded-full border border-[#00FAFF]/20">
                  PROJECT HUD_0{activeIndex + 1}
                </span>
                <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[9px]">
                  <Clock className="size-3" />
                  <span>UPD_2026</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-wide">
                  {activeProject.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono tracking-wider mt-1.5 uppercase">
                  {activeProject.subtitle}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-5">
                <div>
                  <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">RENDER RATE</span>
                  <span className="text-xs font-mono font-medium text-white flex items-center gap-1.5 mt-0.5">
                    <Cpu className="size-3 text-neutral-400 shrink-0" />
                    {activeProject.specs.fps}
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">POLYGON COUNT</span>
                  <span className="text-xs font-mono font-medium text-white flex items-center gap-1.5 mt-0.5">
                    <Layers className="size-3 text-neutral-400 shrink-0" />
                    {activeProject.specs.vertices}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">SHADING GRAPH</span>
                  <span className="text-xs font-mono font-medium text-neutral-300 mt-0.5 flex gap-1.5 items-center">
                    <Zap className="size-3 text-[#00FAFF] shrink-0" />
                    {activeProject.specs.shading}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">COMPILE PIPELINE</span>
                  <span className="text-xs font-mono text-neutral-300 mt-0.5 block border border-dashed border-white/10 p-2 rounded-xl bg-black/40">
                    {activeProject.specs.pipeline}
                  </span>
                </div>
              </div>

              {/* Narrative description */}
              <div className="space-y-2">
                <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">SPATIAL SYNOPSIS</span>
                <p className="text-xs md:text-[13px] text-neutral-400 leading-relaxed font-sans font-light">
                  {activeProject.narrative}
                </p>
              </div>

              {/* Key structures lists */}
              <div className="space-y-2.5">
                <span className="block text-[8px] font-mono text-neutral-500 tracking-wider uppercase">PIPELINE CORE ATTRIBUTES</span>
                <ul className="space-y-1.5">
                  {activeProject.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-xs text-neutral-300 font-sans">
                      <Check className="size-3.5 text-[#00FAFF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Grid of Simulation Capabilities */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-16 pb-6">
        <div className="text-center md:text-left mb-10 max-w-2xl">
          <span className="text-[10px] font-mono text-[#00FAFF] tracking-widest uppercase">TECHNICAL SPHERES // METHODOLOGIES</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1.5 font-display">
            Interactive Engineering Spheres
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm font-light mt-2 leading-relaxed">
            Every dynamic project operates on optimized real-time physics simulators, meteorological atmosphere grids, and spatial occlusion solvers configured explicitly for custom browser canvas loaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portfolio-methodologies-grid">
          {[
            {
              title: "Meteorological Atmospheres",
              subtitle: "DYNAMIC WEATHER SOLVERS",
              desc: "Deploying high-density particle vectors and wind-noise algorithms inside the ThreeJS/WebGL render state to simulate dynamic haze, dust storms, and foggy daylight propagation cycles.",
              icon: Flame,
              badge: "VOLUMETRIC"
            },
            {
              title: "Optic Caustic Mappers",
              subtitle: "REAL-TIME RAY BOUNCING",
              desc: "Simulating refraction indices and caustics maps on complex surfaces (water pools, fiberglass skins) utilizing standard custom shaders operating at fluid refresh speeds.",
              icon: Sliders,
              badge: "RAYMARCHED"
            },
            {
              title: "Adaptive Curvature Tesselators",
              subtitle: "POLYGON WEIGHT SYSTEM",
              desc: "Leveraging custom geometric mesh level-of-detail algorithms (LOD) that reduce polygon complexity in non-focused view regions, saving browser CPU-threads dynamically.",
              icon: TargetIcon,
              badge: "PROPORTIONAL"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors duration-300">
                  <item.icon className="size-5" />
                </div>
                <span className="text-[8px] font-mono text-neutral-500 tracking-widest px-2 py-0.5 rounded border border-white/5">
                  {item.badge}
                </span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-[#00FAFF] tracking-wider block mb-1 uppercase">
                  {item.subtitle}
                </span>
                <h4 className="text-base font-semibold text-white tracking-wide font-display">
                  {item.title}
                </h4>
                <p className="text-xs font-light text-neutral-400 leading-relaxed mt-2.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Simple fallback icon mapping
function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
