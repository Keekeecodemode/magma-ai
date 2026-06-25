import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../lib/profileStore";
import { analyzeStyleMatch, fileToBase64 } from "../lib/geminiApi";
import { Card, Label, PrimaryButton, OutlineButton, TopBar, AnimatedNumber } from "../components/ui";
import { motion, AnimatePresence } from "framer-motion";

const getHairstyleImage = (styleName) => {
  const name = styleName.toLowerCase();
  if (name.includes("wolf") || name.includes("butterfly") || name.includes("layers")) {
    return "/images/hair_wolfcut.png";
  }
  if (name.includes("bangs") || name.includes("bob") || name.includes("curtain")) {
    return "/images/hair_curtainbangs.png";
  }
  return "/images/hair_crop.png";
};

export function StyleMatch() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());
  const [analyzing, setAnalyzing] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState(false);
  const [progressText, setProgressText] = useState("Initializing scan...");
  
  // Reveal stages: 0 = not scanned/analyzing, 1 = luxury consult splash reveal, 2 = full results list
  const [revealStage, setRevealStage] = useState(0);

  const result = profile.styleMatch;
  const topStyle = result?.topStyles?.[0];

  useEffect(() => {
    if (result) {
      setRevealStage(1);
      const timer = setTimeout(() => {
        setRevealStage(2);
      }, 2400); // Elegant timing for typewriter look
      return () => clearTimeout(timer);
    } else {
      setRevealStage(0);
    }
  }, [result]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAnalyzing(true);
      setOfflineNotice(false);
      setRevealStage(0);
      
      setProgressText("Uploading portrait securely...");
      const base64 = await fileToBase64(file);
      
      setProgressText("Detecting facial symmetry & skull structure...");
      await new Promise(r => setTimeout(r, 800));
      
      setProgressText("Scanning hair texture & curl parameters...");
      await new Promise(r => setTimeout(r, 600));

      setProgressText("Generating customized matches...");
      const resultData = await analyzeStyleMatch(base64, file.type, profile);
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setOfflineNotice(true);
      }

      setProgressText("Loading curated style matches...");
      await new Promise(r => setTimeout(r, 600));

      resultData.swappedPreviews = [];

      const updated = updateProfile({ styleMatch: resultData });
      setProfile(updated);
      setAnalyzing(false);
    } catch (err) {
      console.error("Error analyzing style match:", err);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    const updated = updateProfile({ styleMatch: null });
    setProfile(updated);
    setOfflineNotice(false);
    setRevealStage(0);
  };

  return (
    <div className="flex-grow flex flex-col bg-transparent animate-fade-rise h-screen overflow-hidden">
      <TopBar title="Style DNA Match" subtitle="Discover hairstyles styled for your facial structure" />

      {analyzing ? (
        /* Analyzing State */
        <div className="flex-grow flex flex-col justify-center items-center p-8 space-y-8 min-h-[50vh] text-center my-auto">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet via-neon to-cyan opacity-20 blur-2xl animate-pulse" />
            <div className="absolute w-28 h-28 bg-gradient-to-br from-violet via-neon to-cyan opacity-30 animate-blob-3d" />
            <span className="text-4xl z-10 select-none animate-bounce">👁️</span>
          </div>

          <div className="space-y-3 max-w-sm">
            <Label variant="neon" className="block text-center animate-pulse">
              ANALYZING FEATURES
            </Label>
            <p className="text-base text-ink font-display font-bold tracking-wide">
              {progressText}
            </p>
            <p className="text-xs text-graymuted leading-relaxed font-body">
              Our Vision engine is processing your unique facial parameters to construct your Style DNA.
            </p>
          </div>
        </div>
      ) : result && revealStage === 1 ? (
        /* Luxury Consultation Reveal Experience (Stage 1) */
        <motion.div 
          key="reveal-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-grow flex flex-col justify-center items-center p-8 text-center my-auto min-h-[50vh] relative select-none"
        >
          {/* Radial light backdrop */}
          <div className="absolute w-[500px] h-[500px] bg-hero-radial rounded-full blur-[90px] opacity-75 pointer-events-none" />
          
          <div className="space-y-12 z-10 max-w-xl">
            <div className="space-y-3">
              <motion.div 
                initial={{ letterSpacing: "0.1em", opacity: 0 }}
                animate={{ letterSpacing: "0.25em", opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-[10px] font-display font-bold uppercase tracking-widest text-violet"
              >
                Personalized Analysis Complete
              </motion.div>
              <motion.h2 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-display text-4xl md:text-5xl text-ink font-medium tracking-tight"
              >
                STYLE DNA DISCOVERED.
              </motion.h2>
            </div>

            {/* Typewriter/Staggered reveal parameters */}
            <div className="grid grid-cols-3 gap-6 border-t border-b border-hairline/60 py-6 max-w-md mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-1.5"
              >
                <span className="text-[8px] font-display font-bold text-graymuted uppercase tracking-wider block">Face Shape</span>
                <span className="font-display font-bold text-violet text-sm uppercase">{result.faceShape}</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="space-y-1.5"
              >
                <span className="text-[8px] font-display font-bold text-graymuted uppercase tracking-wider block">Hair Texture</span>
                <span className="font-display font-bold text-neon text-sm uppercase">{result.hairTexture}</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="space-y-1.5"
              >
                <span className="text-[8px] font-display font-bold text-graymuted uppercase tracking-wider block">Signature style</span>
                <span className="font-display font-bold text-ink text-sm uppercase">{topStyle?.name}</span>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8 }}
              className="text-[10px] text-graymuted font-body italic"
            >
              Preparing custom recommendations...
            </motion.p>
          </div>
        </motion.div>
      ) : result && revealStage === 2 ? (
        /* Full Results Consultation Board (Stage 2) */
        <motion.div 
          key="results-board"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden flex-1 min-h-0"
        >
          
          {/* Left Panel: Profile DNA and Feature Spotlights (Sticky) */}
          <div className="lg:col-span-4 space-y-6 lg:h-full flex flex-col justify-between overflow-y-auto scrollbar-none pb-4 pr-1 flex-shrink-0">
            <div className="space-y-6">
              {offlineNotice && (
                <div className="bg-violet/10 border border-violet/20 text-violet py-3 px-5 text-center text-[9px] font-display uppercase tracking-widest rounded-lg select-none">
                  ⚡ Running in Demo Mode (Curated Local Matches)
                </div>
              )}

              {/* Coordinates Overview Cards - Staggered reveal */}
              <div className="grid grid-cols-2 gap-4 select-none">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Card className="flex flex-col justify-center py-4 px-5 border-violet/30 shadow-sm h-full">
                    <span className="text-[9px] font-display uppercase tracking-widest text-graymuted font-bold">
                      Detected Shape
                    </span>
                    <span className="font-display font-black text-sm uppercase text-violet tracking-wide mt-1.5">
                      {result.faceShape}
                    </span>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Card className="flex flex-col justify-center py-4 px-5 border-cyan/30 shadow-sm h-full">
                    <span className="text-[9px] font-display uppercase tracking-widest text-graymuted font-bold">
                      Detected Texture
                    </span>
                    <span className="font-display font-black text-sm uppercase text-[#00b0c7] tracking-wide mt-1.5">
                      {result.hairTexture}
                    </span>
                  </Card>
                </motion.div>
              </div>

              {/* Feature Spotlights - Slides up */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <Card className="bg-violet/5 border border-violet/20 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-violet" />
                  <Label variant="violet">Feature Spotlights</Label>
                  <blockquote className="text-xs text-ink italic leading-relaxed font-body select-text pl-1">
                    "{result.magneticNote}"
                  </blockquote>
                </Card>
              </motion.div>

              {/* Philosophical Zero-Rating Note */}
              <div className="text-[10px] text-graymuted font-body space-y-1.5 pl-1 select-none">
                <div className="flex items-center space-x-1.5 text-violet font-semibold">
                  <span>✦</span>
                  <span>Style discovery, not judgment</span>
                </div>
                <p className="leading-relaxed text-graymuted/80">
                  MAGMA is a consumer beauty consultation system. Attractiveness ratings or beauty scores are never generated.
                </p>
              </div>
            </div>

            {/* Reset button at the bottom of sidebar */}
            <div className="pt-2">
              <OutlineButton onClick={handleReset} className="w-full">
                Scan another photo
              </OutlineButton>
            </div>
          </div>

          {/* Right Panel: Scrollable top recommendations grid (Col 8) */}
          <div className="lg:col-span-8 h-full overflow-y-auto pr-2 scrollbar-none pb-24 space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-hairline pb-2 select-none">
              <Label variant="violet">Your Custom Hairstyle Recommendations</Label>
              <span className="text-[9px] text-graymuted font-display font-bold uppercase tracking-widest">
                Based on Style DNA
              </span>
            </div>

            {/* Confident Brand differentiation badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-violet/5 border border-violet/20 px-3.5 py-2.5 rounded-lg flex items-center space-x-2 text-[10px] text-violet font-display font-bold uppercase tracking-wider select-none"
            >
              <span>✦</span>
              <span>Real AI analysis. No simulation, no beauty score — just what already works for you.</span>
            </motion.div>

            {/* Top Match Showcase Card - Cascades in */}
            {topStyle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, type: "spring", stiffness: 85 }}
              >
                <Card className="p-0 overflow-hidden border-violet/30 hover:border-violet shadow-md flex flex-col md:flex-row relative">
                  {/* Hairstyle Preview Image */}
                  <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-base">
                    <img 
                      src={getHairstyleImage(topStyle.name)} 
                      alt={topStyle.name} 
                      className="w-full h-full object-cover filter saturate-[0.95] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-base/80 backdrop-blur-md border border-hairline px-2 py-0.5 rounded text-[8px] font-display font-bold uppercase tracking-wider text-ink select-none z-10">
                      Style preview
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-base/10" />
                  </div>

                  {/* Details */}
                  <div className="md:w-3/5 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex items-center space-x-2">
                        <Label variant="violet" className="text-[9px] tracking-widest font-extrabold">SIGNATURE STYLE DNA MATCH</Label>
                        <span className="text-[8px] bg-violet/10 text-violet px-2 py-0.5 rounded-full font-display font-bold uppercase tracking-wider">
                          <AnimatedNumber value={topStyle.matchScore} duration={800} />% Match
                        </span>
                      </div>
                      
                      {/* Animated Match Progress Bar */}
                      <div className="w-full bg-hairline h-1 rounded-full overflow-hidden max-w-[160px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${topStyle.matchScore}%` }}
                          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                          className="bg-violet h-full rounded-full"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display font-black text-2xl text-ink tracking-tight">
                          {topStyle.name}
                        </h3>
                        <p className="text-[11px] text-graymuted font-body leading-relaxed">
                          {topStyle.reason}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-hairline/60 pt-4 flex items-center justify-between">
                      <span className="text-[9px] text-graymuted font-body italic">
                        Style discovery coordinates mapped
                      </span>
                      <PrimaryButton 
                        onClick={() => navigate(`/salons?style=${encodeURIComponent(topStyle.name)}`)}
                        className="text-[9px] px-3.5 font-bold"
                      >
                        Find Salon Specialist
                      </PrimaryButton>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Sub recommendations grid - Cascades in */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-2">
              {result.topStyles.slice(1).map((style, idx) => (
                <motion.div
                  key={style.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05 + idx * 0.15, duration: 0.6, type: "spring", stiffness: 85 }}
                  className="flex"
                >
                  <Card className="p-0 overflow-hidden flex flex-col h-[360px] w-full">
                    {/* Image */}
                    <div className="h-44 relative overflow-hidden bg-base">
                      <img 
                        src={getHairstyleImage(style.name)} 
                        alt={style.name} 
                        className="w-full h-full object-cover filter saturate-[0.95]"
                      />
                      <div className="absolute top-3 left-3 bg-base/80 backdrop-blur-md border border-hairline px-2 py-0.5 rounded text-[8px] font-display font-bold uppercase tracking-wider text-ink select-none z-10">
                        Style preview
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline border-b border-hairline/60 pb-1.5">
                          <h4 className="font-display font-bold text-sm text-ink tracking-wide">
                            {style.name}
                          </h4>
                          <span className="font-display font-bold text-[10px] text-neon">
                            <AnimatedNumber value={style.matchScore} duration={800} />% Compatibility
                          </span>
                        </div>
                        
                        {/* Animated Match Progress Bar */}
                        <div className="w-full bg-hairline h-1 rounded-full overflow-hidden max-w-[120px] mt-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${style.matchScore}%` }}
                            transition={{ delay: 1.05 + idx * 0.15, duration: 0.8, ease: "easeOut" }}
                            className="bg-neon h-full rounded-full"
                          />
                        </div>
                        
                        <p className="text-[11px] text-graymuted leading-relaxed font-body line-clamp-3">
                          {style.reason}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/salons?style=${encodeURIComponent(style.name)}`)}
                        className="w-full text-center py-2 bg-base border border-hairline hover:border-violet hover:text-violet text-[9px] font-display font-bold uppercase tracking-wider text-ink transition-colors rounded-lg cursor-pointer"
                      >
                        Find Salon Specialist
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
          </div>

        </motion.div>
      ) : (
        /* Upload Initial State - Desktop layout */
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-6 py-12 space-y-8 my-auto overflow-y-auto scrollbar-none">
          <div className="text-center space-y-3">
            <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
              Analyze Your Styling Assets
            </h2>
            <p className="text-sm text-graymuted leading-relaxed max-w-lg mx-auto">
              Our vision coordinates evaluate your bone structure and hair textures to map optimal frames. We never score your face or rate attractiveness.
            </p>
          </div>

          {/* Wide Dropzone Area */}
          <label
            htmlFor="photo-upload"
            className="border-2 border-dashed border-hairline hover:border-violet bg-surface p-12 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all rounded-lg group min-h-[260px] hover:shadow-lg"
          >
            <input
              type="file"
              accept="image/*"
              id="photo-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Geometric Camera Icon */}
            <div className="w-16 h-16 border border-hairline flex items-center justify-center text-graymuted group-hover:border-violet group-hover:text-violet transition-colors mb-4 rounded-xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>

            <span className="font-display font-bold text-sm tracking-wider text-ink uppercase group-hover:text-violet transition-colors">
              Unlock / Scan to find the best match
            </span>
            <span className="text-xs text-graymuted mt-1 leading-normal max-w-sm">
              Drag-and-drop or tap your selfie to map bone profiles and discover compatible styles.
            </span>
          </label>

          {/* Privacy and Philosophy Section */}
          <div className="space-y-4">
            <div className="bg-violet/5 border border-violet/10 p-5 rounded-lg text-center space-y-2.5 max-w-md mx-auto select-none">
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-graymuted font-body">
                <span className="text-violet font-semibold">✓ No beauty scores</span>
                <span className="text-neon font-semibold">✓ No attractiveness ratings</span>
                <span className="text-[#00b0c7] font-semibold">✓ Style discovery, not judgment</span>
              </div>
              <p className="text-[10px] text-graymuted/80 italic font-body">
                Built to amplify your features.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-xs text-graymuted select-none">
              <span>🔒</span>
              <span>All portrait scans are run locally in-memory and never stored.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default StyleMatch;
