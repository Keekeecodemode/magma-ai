import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getProfile } from "../lib/profileStore";

export function Navbar() {
  const location = useLocation();
  const profile = useMemo(() => getProfile(), [location.pathname]);

  const [showSettings, setShowSettings] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => localStorage.getItem("magma_gemini_key") || "");
  const [savedNotice, setSavedNotice] = useState(false);

  const links = [
    { path: "/home", label: "Home" },
    { path: "/ritual", label: "Ritual" },
    { path: "/style", label: "Style Match" },
    { path: "/salons", label: "Salon Finder" },
    { path: "/coach", label: "AI Coach" },
    { path: "/profile", label: "Profile" },
  ];

  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "A";
  const displayName = profile.name ? `${profile.name.split(" ")[0]}` : "Anya V.";

  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem("magma_gemini_key", geminiKeyInput.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <header className="w-full select-none pb-6 flex items-center justify-between border-b border-hairline/60 bg-transparent flex-shrink-0 relative">
      {/* Left: MAGMA.AI logo wordmark in serif */}
      <NavLink to="/" className="flex items-center">
        <span className="font-display font-bold text-lg tracking-[0.05em] text-ink">
          MAGMA.AI
        </span>
      </NavLink>

      {/* Center: Navigation Links in small caps */}
      <nav className="flex items-center space-x-6 md:space-x-8">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `text-[10px] font-body font-bold uppercase tracking-widest transition-all py-1 border-b ${
                isActive 
                  ? "text-ink border-ink" 
                  : "text-graymuted border-transparent hover:text-ink"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right: Avatar and Notification bell */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-right">
          <span className="text-[10px] text-graymuted font-body font-medium select-none">
            Welcome,<br />
            <span className="text-ink font-bold block mt-0.5">{displayName}</span>
          </span>
          <div className="w-8 h-8 bg-violet/10 border border-violet/20 flex items-center justify-center text-xs font-bold text-violet rounded-full select-none">
            {firstLetter}
          </div>
        </div>

        {/* Settings Gear Icon */}
        <div 
          onClick={() => setShowSettings(true)}
          className="cursor-pointer p-1 text-graymuted hover:text-ink transition-colors"
          title="Configure API Keys"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827a1.125 1.125 0 01.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* API Keys Configuration Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
          <div className="bg-surface rounded-lg border border-hairline shadow-2xl p-6 w-full max-w-md animate-fade-rise">
            <div className="flex justify-between items-center border-b border-hairline pb-3 mb-4">
              <h3 className="font-display font-black text-sm text-ink tracking-wide uppercase">
                ✦ API Keys Configuration
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-graymuted hover:text-ink font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveKeys} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-display font-bold uppercase tracking-wider text-neon block">
                  Gemini API Key (Analysis, Coach & Daily Pulse)
                </label>
                <input
                  type="password"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="Paste AI Studio Key..."
                  className="w-full bg-base border border-hairline py-2 px-3 text-xs text-ink font-body rounded-lg focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet"
                />
              </div>
              
              <div className="text-[9px] text-graymuted leading-normal font-body">
                💡 Paste your Gemini API key to activate the Skin/Hair Analysis, AI Coach, and Daily Pulse features. The key is stored safely on your machine in local storage and never sent elsewhere.
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 border border-hairline text-[10px] font-display font-bold uppercase tracking-wider rounded-lg hover:bg-base cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet text-white text-[10px] font-display font-bold uppercase tracking-wider rounded-lg hover:bg-violet/90 hover:shadow-glow-violet cursor-pointer"
                >
                  {savedNotice ? "✓ Saved!" : "Save Keys"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;
