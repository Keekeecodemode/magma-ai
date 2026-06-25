import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../lib/profileStore";

/**
 * Screen wrapper: Centered floating card inside the highly vibrant, animated mesh background.
 * Incorporates rotating geometric wireframe rings and floating sparkles for a detailed, high-fashion aesthetic.
 */
export function Screen({ children, className = "" }) {
  return (
    <div className="w-full min-h-screen bg-base flex flex-col relative overflow-x-hidden select-none">
      
      {/* Dynamic Background Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* Subtle Tech Animated Gradient Mesh Orbs */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-violet rounded-full blur-[140px] opacity-[0.08] orb-lavender animate-breathing-glow" />
        <div className="absolute top-[2%] right-[5%] w-[550px] h-[550px] bg-accent2 rounded-full blur-[120px] opacity-[0.05] orb-peach animate-breathing-glow" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-[2%] right-[10%] w-[550px] h-[550px] bg-neon rounded-full blur-[120px] opacity-[0.06] orb-cyan animate-breathing-glow" style={{ animationDelay: "-6s" }} />
      </div>

      {/* Full width content wrapper, centered inner column */}
      <div className={`w-full max-w-[1400px] mx-auto flex-1 flex flex-col relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * PrimaryButton: Pill button (rounded-full) in violet, white, or light purple.
 */
export function PrimaryButton({ children, className = "", onClick, disabled, variant = "violet", ...props }) {
  let bgClass = "bg-violet text-white hover:bg-[#6b2fd4] hover:shadow-glow-violet shadow-sm";
  if (variant === "white") {
    bgClass = "bg-white text-ink border border-hairline hover:bg-base/60 hover:shadow-sm";
  } else if (variant === "purple-light") {
    bgClass = "bg-violet/10 text-violet border border-violet/15 hover:bg-violet/20 hover:shadow-sm";
  } else if (variant === "red-light") {
    bgClass = "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-sm";
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-5 text-center font-body font-bold text-xs tracking-wide transition-all duration-200 select-none rounded-full flex items-center justify-center space-x-1.5
        ${disabled 
          ? "bg-hairline text-graymuted cursor-not-allowed opacity-50" 
          : `${bgClass} hover:-translate-y-0.5 cursor-pointer`
        } 
        ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * OutlineButton: Pill button (rounded-full) in transparent border.
 */
export function OutlineButton({ children, className = "", onClick, disabled, ...props }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-5 text-center font-body font-bold text-xs tracking-wide transition-all duration-200 border border-violet text-violet bg-transparent hover:bg-violet/5 rounded-full select-none
        ${disabled 
          ? "border-hairline text-graymuted cursor-not-allowed opacity-50" 
          : `hover:-translate-y-0.5 cursor-pointer`
        } 
        ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Card: Frosted glassmorphic sub-card with a 16px radius, thin border, soft inner mesh gradient, and soft shadow.
 */
export function Card({ children, className = "", onClick, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`glass-subcard p-6 rounded-lg border border-hairline shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(109,94,245,0.08)] transition-all duration-300 relative overflow-hidden ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      } ${className}`}
      {...props}
    >
      {/* Soft inner radial glows for key cards to avoid looking plain */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.02),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(233,53,193,0.02),transparent_40%)] pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Label: Small caps section label. Uses static classes to map color variants.
 */
export function Label({ children, className = "", variant = "violet" }) {
  let colorClass = "text-violet"; // default
  
  if (variant === "cyan") {
    colorClass = "text-[#00afc5]";
  } else if (variant === "neon") {
    colorClass = "text-neon";
  } else if (variant === "graymuted") {
    colorClass = "text-graymuted";
  } else if (variant === "ink") {
    colorClass = "text-ink";
  }

  return (
    <span 
      className={`font-display text-[9px] font-extrabold tracking-widest uppercase ${colorClass} ${className}`}
      style={{ fontVariant: "all-small-caps" }}
    >
      {children}
    </span>
  );
}

/**
 * TopBar: Display header at the top of desktop pages.
 */
export function TopBar({ title, subtitle, rightSlot, onBack }) {
  return (
    <div className="w-full flex items-center justify-between select-none pb-4 border-b border-hairline/60">
      <div className="flex items-center space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="text-graymuted hover:text-ink active:scale-[0.9] transition-transform p-1.5 border border-hairline bg-white/40 backdrop-blur-md rounded-full hover:shadow-sm cursor-pointer"
            aria-label="Back"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="font-display font-extrabold text-2xl text-ink tracking-wide leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-graymuted font-body mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {rightSlot && <div className="flex items-center">{rightSlot}</div>}
    </div>
  );
}

/**
 * StyleDNACard: Persistent core identity card displaying style coordinates and linking key sections.
 */
export function StyleDNACard({ className = "", layout = "wide" }) {
  const navigate = useNavigate();
  const profile = getProfile();
  const hasStyleDNA = !!profile.styleMatch;

  const isSidebar = layout === "sidebar";

  if (!hasStyleDNA) {
    return (
      <Card className={`bg-gradient-to-tr from-surface to-violet/5 border-hairline hover:border-violet relative overflow-hidden shadow-md group ${className}`}>
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet/5 to-neon/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className={`flex flex-col ${isSidebar ? "" : "md:flex-row md:items-center"} justify-between gap-5`}>
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2 select-none">
              <span className="text-[9px] bg-violet/10 text-violet px-2.5 py-1 rounded-full font-display font-bold uppercase tracking-wider">Style DNA Core</span>
              <span className="text-[9px] text-graymuted font-body font-semibold">🔒 Locked</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg text-ink tracking-tight flex items-center space-x-1.5">
                <span>Style DNA Locked</span>
              </h3>
              <p className="text-[11px] text-graymuted font-body leading-relaxed max-w-xl">
                Scan your portrait selfie to decode your face shape, hair texture coordinates, and find your absolute best matching styles.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 select-none w-full md:w-auto">
            <PrimaryButton 
              onClick={() => navigate("/style")}
              className="text-[10px] font-display font-bold uppercase tracking-wider w-full md:w-auto text-center py-2.5 px-5 hover:shadow-glow-violet shadow-sm"
            >
              Unlock / Scan to find best match
            </PrimaryButton>
          </div>
        </div>
      </Card>
    );
  }

  const signatureStyle = profile.styleMatch?.topStyles?.[0]?.name || "Ready to Scan";
  const faceShape = profile.styleMatch?.faceShape || "Oval (Default)";
  const hairTexture = profile.styleMatch?.hairTexture || "Wavy (Default)";

  return (
    <Card className={`bg-gradient-to-tr from-surface to-violet/5 border-hairline hover:border-violet relative overflow-hidden shadow-md group ${className}`}>
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-violet/5 to-neon/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className={`flex flex-col ${isSidebar ? "" : "md:flex-row md:items-center"} justify-between gap-5`}>
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-2 select-none">
            <span className="text-[9px] bg-violet/10 text-violet px-2.5 py-1 rounded-full font-display font-bold uppercase tracking-wider">Style DNA Core</span>
            {!isSidebar && (
              <span className="text-[9px] text-graymuted font-body">Discovered • Maintained • Interpreted • Executed</span>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="font-display font-black text-lg text-ink tracking-tight">
              Personalized Style DNA
            </h3>
            {!isSidebar && (
              <p className="text-[11px] text-graymuted font-body leading-relaxed max-w-xl">
                Your Style DNA is the primary identity powering this application. Discovered via facial parameters scan, maintained through daily rituals, interpreted by advisor, and executed by salons.
              </p>
            )}
          </div>

          {/* Action Chips */}
          {!isSidebar && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 select-none">
              <button 
                onClick={() => navigate("/style")}
                className="flex flex-col p-2 border border-hairline hover:border-violet bg-base/40 hover:bg-violet/5 transition-all rounded-lg text-left cursor-pointer"
              >
                <span className="text-[7.5px] font-display font-bold text-violet uppercase tracking-wider">01. Discover</span>
                <span className="text-[9.5px] font-display font-bold text-ink mt-0.5">Style Match</span>
              </button>
              <button 
                onClick={() => navigate("/ritual")}
                className="flex flex-col p-2 border border-hairline hover:border-violet bg-base/40 hover:bg-violet/5 transition-all rounded-lg text-left cursor-pointer"
              >
                <span className="text-[7.5px] font-display font-bold text-neon uppercase tracking-wider">02. Maintain</span>
                <span className="text-[9.5px] font-display font-bold text-ink mt-0.5">Glow Rituals</span>
              </button>
              <button 
                onClick={() => navigate("/coach")}
                className="flex flex-col p-2 border border-hairline hover:border-violet bg-base/40 hover:bg-violet/5 transition-all rounded-lg text-left cursor-pointer"
              >
                <span className="text-[7.5px] font-display font-bold text-neon uppercase tracking-wider">03. Interpret</span>
                <span className="text-[9.5px] font-display font-bold text-ink mt-0.5">Advisor Coach</span>
              </button>
              <button 
                onClick={() => navigate("/salons")}
                className="flex flex-col p-2 border border-hairline hover:border-violet bg-base/40 hover:bg-violet/5 transition-all rounded-lg text-left cursor-pointer"
              >
                <span className="text-[7.5px] font-display font-bold text-graymuted uppercase tracking-wider">04. Execute</span>
                <span className="text-[9.5px] font-display font-bold text-ink mt-0.5">Specialist Salons</span>
              </button>
            </div>
          )}
        </div>

        {/* Coordinates Panel */}
        <div className={`flex flex-col bg-base border border-hairline p-4 rounded-lg shadow-sm select-none divide-y divide-hairline/60 ${isSidebar ? "w-full" : "min-w-[190px]"}`}>
          <div className="pb-2 flex justify-between items-center text-[10px] font-body">
            <span className="text-graymuted">Face Shape:</span>
            <span className="font-display font-bold text-violet uppercase tracking-wide">{faceShape}</span>
          </div>
          <div className="py-2 flex justify-between items-center text-[10px] font-body">
            <span className="text-graymuted">Hair Texture:</span>
            <span className="font-display font-bold text-neon uppercase tracking-wide">{hairTexture}</span>
          </div>
          <div className="py-2 flex justify-between items-center text-[10px] font-body">
            <span className="text-graymuted">Signature:</span>
            <span className="font-display font-bold text-ink uppercase tracking-wide truncate max-w-[100px]">{signatureStyle}</span>
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px] font-body">
            <span className="text-graymuted">Glow Streak:</span>
            <span className="font-display font-black text-ink uppercase tracking-wider flex items-center space-x-0.5">
              <span><AnimatedNumber value={profile.streak} /> Days</span>
              <span className="text-[11px]">🔥</span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AnimatedNumber({ value, duration = 600, suffix = "" }) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp = null;
    const endVal = parseInt(value, 10) || 0;
    if (endVal === 0) {
      setCurrent(0);
      return;
    }
    
    let animationFrameId;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCurrent(Math.floor(progress * endVal));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{current}{suffix}</span>;
}

export default Screen;
