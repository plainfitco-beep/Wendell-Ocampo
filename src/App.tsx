/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { SplineSceneBasic } from "@/components/ui/demo";
import { Navbar } from "@/components/ui/navbar";
import DemoOne from "@/components/ui/feature-demo";
import { GallerySection } from "@/components/ui/gallery-section";
import { SignupSection } from "@/components/ui/signup-section";
import { Footer } from "@/components/ui/footer-section";
import { ThreeDGalleryPage } from "@/components/ui/three-d-gallery";
import { AssetsPage } from "@/components/ui/assets-page";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'assets'>('home');

  // Automatically scroll to top on page switches to keep experience fluid
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white flex flex-col items-center relative overflow-x-hidden font-sans">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent" />
      </div>

      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'gallery' ? (
        <div className="w-full pt-28 md:pt-36 relative z-10 flex-1">
          <ThreeDGalleryPage onBack={() => setCurrentPage('home')} />
        </div>
      ) : currentPage === 'assets' ? (
        <div className="w-full pt-28 md:pt-36 relative z-10 flex-1">
          <AssetsPage />
        </div>
      ) : (
        <main className="w-full flex flex-col items-center relative z-10">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
            <SplineSceneBasic />
          </div>
          
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <DemoOne onEnterAssets={() => setCurrentPage('assets')} />
          </div>

          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <GallerySection onEnterShowroom={() => setCurrentPage('gallery')} />
          </div>

          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SignupSection />
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
