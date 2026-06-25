import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../lib/profileStore";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const profile = getProfile();
      if (profile.onboarded) {
        navigate("/home");
      } else {
        navigate("/onboarding/name");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 bg-base flex flex-col justify-between items-center py-20 px-6 relative overflow-hidden animate-fade-rise min-h-screen">
      {/* Background Soft Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />

      {/* Spacing element */}
      <div />

      {/* Main 3D Floating Blob Visual */}
      <div className="relative w-80 h-80 flex items-center justify-center z-10 select-none">
        {/* Soft neon glow background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet via-neon to-cyan opacity-20 blur-3xl animate-pulse" />
        
        {/* CSS 3D Fluid Blob */}
        <div className="absolute w-64 h-64 bg-gradient-to-br from-violet via-neon to-cyan opacity-35 animate-blob-3d" />
        
        {/* Floating sparkles and core icon */}
        <span className="text-4xl text-violet animate-bounce z-20">✦</span>
      </div>

      {/* Logo Wordmark and Tagline */}
      <div className="text-center z-20 select-none space-y-4">
        <h1 className="font-display font-black text-5xl tracking-tight leading-none text-ink">
          MAGMA<span className="bg-gradient-to-r from-violet to-neon bg-clip-text text-transparent">.AI</span>
        </h1>
        
        {/* Brand Tagline in small caps, wide letter-spacing */}
        <div 
          className="text-graymuted text-xs uppercase font-display tracking-[0.35em] tagline-style"
          style={{ fontVariant: "all-small-caps" }}
        >
          BE MAGNETIC
        </div>
      </div>

      {/* Dots Indicator at the Bottom */}
      <div className="flex space-x-2.5 z-20 select-none">
        <div className="w-2 h-2 bg-violet rounded-full animate-ping" />
        <div className="w-2 h-2 bg-hairline rounded-full" />
        <div className="w-2 h-2 bg-hairline rounded-full" />
      </div>
    </div>
  );
}
export default Splash;
