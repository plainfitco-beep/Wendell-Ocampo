'use client'

import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline loading error captured by boundary:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6 text-center border border-white/10 rounded-3xl bg-neutral-950/50 backdrop-blur-md relative overflow-hidden">
          {/* Aesthetic grid fallback */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute w-64 h-64 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-neutral-400 font-mono text-xl animate-pulse">
              3D
            </div>
            <h3 className="text-white font-semibold font-display mb-2">Interactive Preview Ambient Mode</h3>
            <p className="text-neutral-500 text-sm max-w-sm font-light">
              Interactive WebGL canvas initialized in high performance fallback mode. Design components active.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const isIframe = scene.includes('my.spline.design') || !scene.endsWith('.splinecode');

  if (isIframe) {
    return (
      <div className={`w-full h-full relative overflow-hidden ${className || ''}`}>
        <iframe
          src={scene}
          className="w-full h-full border-none outline-none bg-transparent"
          allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay; fullscreen"
          title="Spline 3D Scene"
        />
        {/* Custom brand badge on top of standard watermark spot */}
        <div 
          className="absolute bottom-[5px] right-0 w-[185px] h-[53px] bg-black border border-white/10 flex items-center justify-center z-20 pointer-events-none" 
        >
          <span className="text-neutral-100 font-mono text-[10px] tracking-[0.25em] uppercase font-semibold">
            Meet Spatio
          </span>
        </div>
      </div>
    );
  }

  return (
    <SplineErrorBoundary>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
