import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProfile } from "../lib/profileStore";
import { getRitualForProfile } from "../data/rituals";
import { getDailyPulse } from "../lib/claudeApi";
import { Card, Label, PrimaryButton, StyleDNACard } from "../components/ui";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 15 
    } 
  }
};

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const word = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Re-sync profile from localStorage whenever route changes
  const initialProfile = useMemo(() => getProfile(), [location.pathname]);
  const [profile, setProfile] = useState(initialProfile);

  // Sync profile when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Daily pulse states
  const [pulse, setPulse] = useState(null);
  const [pulseLoading, setPulseLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setPulseLoading(true);
    
    getDailyPulse(profile)
      .then((data) => {
        if (active) {
          setPulse(data);
          setPulseLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          setPulseLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [profile.name, profile.age, profile.gender, profile.hairType, profile.skinType]);

  // Load rituals
  const rituals = useMemo(() => getRitualForProfile(profile), [profile]);
  const totalRituals = useMemo(() => {
    return (rituals.morning?.length || 0) + (rituals.evening?.length || 0);
  }, [rituals]);

  const completedTodayCount = useMemo(() => {
    return (profile.completedToday || []).length;
  }, [profile.completedToday]);

  const completionRatio = totalRituals > 0 ? (completedTodayCount / totalRituals) * 100 : 0;

  // DNA mapping parameters
  const signatureStyle = profile.styleMatch?.topStyles?.[0]?.name || "Ready to scan";
  const hasStyleDNA = !!profile.styleMatch;
  const faceShape = profile.styleMatch?.faceShape || "Oval (Default)";
  const hairTexture = profile.styleMatch?.hairTexture || "Wavy (Default)";

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-between items-center relative space-y-6">
      {/* Background Soft Blob Behind Headline */}
      <div className="absolute top-[10%] left-[25%] w-[450px] h-[450px] bg-gradient-to-tr from-violet/5 via-neon/5 to-cyan/5 rounded-full blur-[120px] pointer-events-none animate-breathing-glow" />

      {/* Hero Redesign: Editorial breathing radial gradient glow area */}
      <div className="w-full bg-hero-radial border border-hairline p-8 md:p-12 text-center rounded-lg shadow-sm mb-6 relative overflow-hidden select-none">
        {/* Slow-drifting premium background gradient blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-violet/10 rounded-full blur-[80px] pointer-events-none select-none orb-lavender" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] bg-neon/10 rounded-full blur-[80px] pointer-events-none select-none orb-cyan" style={{ animationDelay: "-4s" }} />

        {/* Soft floating glow particles */}
        <div className="absolute top-[10%] left-[20%] text-violet/30 text-xl animate-pulse">✦</div>
        <div className="absolute bottom-[20%] right-[20%] text-neon/30 text-lg animate-pulse" style={{ animationDelay: "1s" }}>✦</div>
        
        <motion.h2 
          variants={sentence}
          initial="hidden"
          animate="visible"
          className="font-display font-medium text-6xl text-ink leading-tight select-none flex flex-wrap justify-center gap-x-3"
        >
          {`Be Magnetic,`.split(" ").map((w, idx) => (
            <motion.span key={idx} variants={word}>{w}</motion.span>
          ))}
          <motion.span 
            variants={word}
            className="bg-gradient-to-r from-violet via-neon to-[#00b0c7] bg-clip-text text-transparent font-bold"
          >
            {profile.name || "Groomer"}.
          </motion.span>
        </motion.h2>
        <p className="text-[10px] text-graymuted uppercase font-body tracking-[0.3em] mt-3 select-none">
          Style Discovery, Not Judgment • Built to Amplify Your Contours
        </p>
      </div>

      {/* Connected Style DNA Centerpiece Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="w-full mb-6 z-10"
      >
        <StyleDNACard />
      </motion.div>

      {/* Daily Pulse: Centerpiece Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full z-10"
      >
        <Card className="p-8 bg-gradient-to-tr from-surface to-surface/70 border-hairline shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Dewy Affirmation (Visual Dominance) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 select-none">
                <span className="text-xs bg-violet/10 text-violet px-2.5 py-1 rounded-full font-display font-bold uppercase tracking-wider text-[9px]">Glow Insights</span>
                <span className="text-[9px] text-graymuted font-body">Today's Reflection</span>
              </div>
              
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-violet block select-none">DAILY AFFIRMATION</span>
              
              {pulseLoading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-5 h-5 border-2 border-violet border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-graymuted font-body">Consulting self-care insights for your styling canvas...</p>
                </div>
              ) : pulse ? (
                <div>
                  <blockquote className="font-display font-medium text-3xl md:text-4xl text-ink leading-relaxed italic pr-4 select-text">
                    "{pulse.affirmation}"
                  </blockquote>
                  
                  {/* Small Support Tips and Facts below the affirmation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-hairline/60 mt-6 select-text">
                    <div className="space-y-1">
                      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-neon block select-none">Personalized Insight</span>
                      <p className="text-xs text-graymuted font-body leading-relaxed">
                        {pulse.tip}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#00b0c7] block select-none">Grooming Fact</span>
                      <p className="text-xs text-graymuted font-body leading-relaxed">
                        {pulse.fact}
                      </p>
                      {pulse.source && (
                        <span className="text-[8px] text-graymuted/70 font-body block italic mt-1 select-none">
                          Source: {pulse.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-graymuted">
                  Failed to load daily insights. Please check connection.
                </div>
              )}
            </div>
            
            {/* Right Column: selfcare_lifestyle image with soft-masked edge overlays */}
            <div className="lg:col-span-4 relative h-64 rounded-lg overflow-hidden shadow-sm border border-hairline">
              <img 
                src="/images/selfcare_lifestyle.png" 
                alt="Dewy selfcare lifestyle close-up" 
                className="w-full h-full object-cover filter saturate-[0.95]"
              />
              {/* Soft gradient edge mask overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-base/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Premium zero-attractiveness rating philosophy footer */}
          <div className="border-t border-hairline/60 pt-4 mt-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-graymuted font-body space-y-2 md:space-y-0 select-none">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              <span className="text-violet font-semibold">✓ No beauty scores</span>
              <span className="text-neon font-semibold">✓ No attractiveness ratings</span>
              <span className="text-[#00b0c7] font-semibold">✓ Style discovery, not judgment</span>
            </div>
            <span className="italic text-graymuted/85">Built to amplify your features.</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
export default Home;
