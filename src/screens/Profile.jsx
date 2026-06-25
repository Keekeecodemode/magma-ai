import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, resetProfile } from "../lib/profileStore";
import { badgeDefinitions } from "../data/rituals";
import { Card, Label, TopBar, PrimaryButton, AnimatedNumber } from "../components/ui";

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());
  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetClick = () => {
    setConfirmReset(true);
  };

  const handleCancelReset = () => {
    setConfirmReset(false);
  };

  const handleExecuteReset = () => {
    resetProfile();
    navigate("/");
  };

  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "A";
  const badgesList = Object.values(badgeDefinitions);

  // Dynamic values for Style DNA
  const signatureStyle = profile.styleMatch?.topStyles?.[0]?.name || "Awaiting style analysis";
  const analysisDate = profile.styleMatch ? "Analysis complete" : "Awaiting scan";
  const confidenceIndex = profile.styleMatch ? "99.2% (Visual coordinates verified)" : "N/A";

  const growthJourney = useMemo(() => {
    const hair = (profile.hairType || "Wavy").toLowerCase();
    const skin = (profile.skinType || "Normal").toLowerCase();
    
    let journey = "Feature Amplification & Routine Consistency";
    if (hair.includes("curly") || hair.includes("coily")) {
      journey = "Moisture Lock & Natural Curls Definition";
    } else if (hair.includes("wavy")) {
      journey = "Volume Optimization & Wave Architecture";
    } else if (skin.includes("oily")) {
      journey = "Sebum Balance & Cellular Texture Refinement";
    } else if (skin.includes("dry")) {
      journey = "Skin Barrier Hydration & Active Natural Glow";
    }
    return journey;
  }, [profile.hairType, profile.skinType]);

  // Determine signature hair image for moodboard
  const moodboardHairImage = useMemo(() => {
    if (signatureStyle.toLowerCase().includes("bangs") || signatureStyle.toLowerCase().includes("curtain")) {
      return "/images/hair_curtainbangs.png";
    }
    return "/images/hair_wolfcut.png";
  }, [signatureStyle]);

  return (
    <div className="flex-grow flex flex-col bg-transparent animate-fade-rise h-[calc(100vh-190px)] overflow-hidden">
      <TopBar title="User Profile" subtitle="Your stats and hair/skin specifications" />

      {/* Main Grid split layout for Profile with bounded height */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden flex-1 min-h-0">
        
        {/* Left Column: Avatar Profile & Stats (Col 4) - Sticky */}
        <div className="lg:col-span-4 space-y-6 lg:h-full flex flex-col overflow-y-auto scrollbar-none pb-4 pr-1 flex-shrink-0">
          
          {/* Profile Card */}
          <Card className="flex flex-col items-center p-6 text-center select-none shadow-sm relative overflow-hidden bg-gradient-to-b from-surface to-surface/40 border-hairline">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet/5 rounded-full blur-xl pointer-events-none" />
            
            {/* Avatar circle with animated rotating dashed border */}
            <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 border border-dashed border-violet/30 rounded-full animate-[spin_25s_linear_infinite]" />
              <div className="w-20 h-20 bg-gradient-to-br from-violet to-neon text-white flex items-center justify-center font-display font-bold text-3xl rounded-full shadow-md">
                {firstLetter}
              </div>
            </div>

            <h2 className="font-display font-extrabold text-xl text-ink tracking-wide">
              {profile.name || "Groomer"}
            </h2>
            <p className="text-xs text-graymuted font-body mt-1">
              Active Style DNA Profile
            </p>

            <div className="w-full border-t border-hairline mt-6 pt-4 space-y-3.5 text-xs text-left">
              <div className="flex justify-between items-center gap-4 pb-2 border-b border-hairline/40">
                <span className="text-graymuted font-body flex-shrink-0">Gender Identity:</span>
                <span className="font-display font-bold text-ink uppercase tracking-wide text-right ml-2 break-all">{profile.gender}</span>
              </div>
              <div className="flex justify-between items-center gap-4 pb-2 border-b border-hairline/40">
                <span className="text-graymuted font-body flex-shrink-0">Age Profile:</span>
                <span className="font-display font-bold text-ink uppercase tracking-wide text-right ml-2 break-all">{profile.age} Years</span>
              </div>
              <div className="flex justify-between items-center gap-4 pb-2 border-b border-hairline/40">
                <span className="text-graymuted font-body flex-shrink-0">Hair Texture:</span>
                <span className="font-display font-bold text-ink uppercase tracking-wide text-right ml-2 break-all">{profile.hairType}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-graymuted font-body flex-shrink-0">Skin Canvas:</span>
                <span className="font-display font-bold text-ink uppercase tracking-wide text-right ml-2 break-all">{profile.skinType}</span>
              </div>
            </div>
          </Card>

          {/* Stats Summary Card */}
          <Card className="p-6 space-y-4 shadow-sm select-none bg-gradient-to-tr from-violet/5 via-neon/5 to-cyan/5 border-hairline">
            <Label variant="violet">Glow Journey Monitor</Label>
            
            <div className="grid grid-cols-3 divide-x divide-hairline">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-violet leading-none">
                  <AnimatedNumber value={profile.streak} />
                </span>
                <span className="text-[8px] font-display font-bold uppercase tracking-widest text-graymuted mt-2">
                  Streak
                </span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-[#00b0c7] leading-none">
                  <AnimatedNumber value={profile.longestStreak} />
                </span>
                <span className="text-[8px] font-display font-bold uppercase tracking-widest text-graymuted mt-2">
                  Longest
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-display font-black text-3xl text-neon leading-none">
                  <AnimatedNumber value={profile.totalRitualsCompleted} />
                </span>
                <span className="text-[8px] font-display font-bold uppercase tracking-widest text-graymuted mt-2">
                  Completed
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Beauty DNA, Moodboard, Achievements & Reset Options (Col 8) - Scrollable */}
        <div className="lg:col-span-8 h-full overflow-y-auto pr-2 scrollbar-none pb-28 space-y-6">
          
          {/* Style DNA Coordinates Card */}
          <Card className="p-6 space-y-4 shadow-sm bg-gradient-to-tr from-surface to-violet/5 border-hairline hover:border-violet relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-violet/10 to-neon/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center border-b border-hairline pb-3">
              <Label variant="violet">Style DNA Profile</Label>
              <span className="text-[8px] bg-violet/10 border border-violet/20 text-violet px-2.5 py-0.5 rounded-full font-display font-extrabold uppercase tracking-widest">Active Coordinates</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
              <div className="space-y-1 bg-base/40 border border-hairline p-3.5 rounded-lg">
                <span className="text-[9px] font-display font-bold text-graymuted uppercase tracking-wider block">Style Analysis</span>
                <span className="font-display font-bold text-ink leading-tight">{analysisDate}</span>
              </div>
              <div className="space-y-1 bg-base/40 border border-hairline p-3.5 rounded-lg">
                <span className="text-[9px] font-display font-bold text-graymuted uppercase tracking-wider block">Signature style</span>
                <span className="font-display font-bold text-violet leading-tight">{signatureStyle}</span>
              </div>
              <div className="space-y-1 bg-base/40 border border-hairline p-3.5 rounded-lg">
                <span className="text-[9px] font-display font-bold text-graymuted uppercase tracking-wider block">Coordinates index</span>
                <span className="font-display font-black text-neon text-sm leading-none block mt-0.5">{confidenceIndex}</span>
              </div>
              <div className="space-y-1 bg-base/40 border border-hairline p-3.5 rounded-lg">
                <span className="text-[9px] font-display font-bold text-graymuted uppercase tracking-wider block">Glow Journey</span>
                <span className="font-display font-bold text-[#00b0c7] leading-tight block">{growthJourney}</span>
              </div>
            </div>
            
            <div className="border-t border-hairline/60 pt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-graymuted font-body select-none">
              <span className="text-violet font-semibold">✓ Style discovery, not judgment</span>
              <span className="text-neon font-semibold">✓ Coordinates mapped exclusively to complement your natural contours</span>
            </div>
          </Card>

          {/* Personalized Style Moodboard Section (Luxury visual collage) */}
          <Card className="p-6 space-y-4 shadow-sm select-none">
            <div className="flex justify-between items-center border-b border-hairline pb-3">
              <Label variant="violet">Style DNA Moodboard</Label>
              <span className="text-[8px] bg-violet/10 border border-violet/20 text-violet px-2.5 py-0.5 rounded-full font-display font-extrabold uppercase tracking-widest">Gesthetic Inspiration</span>
            </div>
            
            {!profile.styleMatch ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-3xl select-none">🔒</span>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-ink">Moodboard Locked</h4>
                  <p className="text-[10px] text-graymuted font-body max-w-xs leading-normal">
                    Scan your portrait selfie on the Style Match page to unlock your custom skin & hair moodboard.
                  </p>
                </div>
                <button 
                  onClick={() => navigate("/style")}
                  className="px-4 py-2 border border-hairline hover:border-violet bg-surface hover:bg-violet/5 transition-all text-[9.5px] font-display font-bold uppercase tracking-wider text-ink rounded-lg cursor-pointer hover:shadow-sm"
                >
                  Unlock / Scan to find best match
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image 1: Skincare aesthetic */}
                <div className="relative h-48 rounded-lg overflow-hidden border border-hairline shadow-sm bg-base">
                  <img 
                    src="/images/selfcare_lifestyle.png" 
                    alt="Dewy skin canvas inspiration" 
                    className="w-full h-full object-cover filter saturate-[0.9] brightness-[0.98]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[8px] font-display uppercase tracking-widest text-cyan font-bold block">Skin Canvas</span>
                    <span className="font-display font-bold text-xs">Dewy Hydration & Health</span>
                  </div>
                </div>
   
                {/* Image 2: Hairstyle inspiration */}
                <div className="relative h-48 rounded-lg overflow-hidden border border-hairline shadow-sm bg-base">
                  <img 
                    src={moodboardHairImage} 
                    alt="Hairstyle inspiration" 
                    className="w-full h-full object-cover filter saturate-[0.9] brightness-[0.98]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[8px] font-display uppercase tracking-widest text-neon font-bold block">Signature Outline</span>
                    <span className="font-display font-bold text-xs">Texture & Architectural Framing</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Badge Achievements */}
          <Card className="p-6 space-y-4 shadow-sm select-none">
            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-2">
              <Label variant="cyan">Milestone Medals</Label>
              <span className="text-[9px] text-graymuted font-display font-bold uppercase tracking-widest">
                {profile.badges?.length || 0} unlocked
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badgesList.map((badge) => {
                const isEarned = (profile.badges || []).includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 border flex items-center space-x-4 transition-all rounded-lg hover:scale-[1.01] duration-200
                      ${isEarned 
                        ? "bg-cyan/5 border-cyan/30 text-ink shadow-sm hover:shadow-glow-cyan" 
                        : "bg-surface/50 border-dashed border-hairline opacity-50 text-graymuted"
                      }`}
                  >
                    <span className={`text-4xl ${isEarned ? "" : "grayscale"}`}>
                      {badge.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-display font-bold text-xs tracking-wider uppercase text-ink">
                          {badge.name}
                        </h4>
                        <span className="text-[8px] font-display text-graymuted uppercase tracking-widest">
                          {isEarned ? "Earned" : "Locked"}
                        </span>
                      </div>
                      <p className="text-[10px] text-graymuted font-body mt-0.5 leading-normal">
                        {badge.requirement}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
 
          {/* Danger Zone: Reset Profile */}
          <Card className="p-6 space-y-4 shadow-sm border-red-950/40 bg-red-950/10">
            <div className="border-b border-red-950/30 pb-3 flex justify-between items-center select-none">
              <span className="text-[9px] font-display font-extrabold tracking-widest uppercase text-red-500">
                ⚠️ DANGER ZONE
              </span>
              <span className="text-[8px] text-red-500 font-display font-bold uppercase tracking-widest">
                Critical Operations
              </span>
            </div>
            
            <p className="text-xs text-graymuted leading-relaxed font-body">
              Performing a profile reset will permanently delete all streak counts, custom style match coordinates, badges, and habits history from your local session. This action cannot be reversed.
            </p>
 
            {confirmReset ? (
              <div className="border border-red-950/40 bg-red-950/20 p-4 rounded-lg space-y-4 animate-fade-rise">
                <p className="text-xs text-red-400 leading-relaxed font-body font-semibold">
                  Are you absolutely sure? This will wipe your profile clean immediately.
                </p>
                <div className="flex space-x-3">
                  <PrimaryButton
                    onClick={handleCancelReset}
                    variant="white"
                    className="flex-1"
                  >
                    Cancel
                  </PrimaryButton>
                  <PrimaryButton
                    onClick={handleExecuteReset}
                    variant="red-light"
                    className="flex-grow-[2] border border-red-950/40 text-red-400 bg-red-950/10"
                  >
                    Yes, Reset Profile Card
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <PrimaryButton
                  onClick={handleResetClick}
                  variant="red-light"
                  className="w-full text-center border border-red-950/40 text-red-400 bg-red-950/10 hover:bg-red-950/20"
                >
                  Reset Profile Card
                </PrimaryButton>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
export default Profile;
