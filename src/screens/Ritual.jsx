import React, { useState, useMemo } from "react";
import { getProfile, toggleRitualItem } from "../lib/profileStore";
import { getRitualForProfile, badgeDefinitions } from "../data/rituals";
import { Card, Label, TopBar, StyleDNACard } from "../components/ui";
import { motion } from "framer-motion";

const radius = 42;
const circumference = 2 * Math.PI * radius;

export function Ritual() {
  const [profile, setProfile] = useState(() => getProfile());
  const [expandedId, setExpandedId] = useState(null);

  // Load rituals tailored to user attributes
  const rituals = useMemo(() => getRitualForProfile(profile), [profile]);

  const handleToggleHabit = (id, e) => {
    e.stopPropagation();
    const updated = toggleRitualItem(id);
    setProfile(updated);
  };

  const handleCardTap = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const badgesList = Object.values(badgeDefinitions);

  const totalRituals = useMemo(() => {
    return (rituals.morning?.length || 0) + (rituals.evening?.length || 0);
  }, [rituals]);

  const completedTodayCount = useMemo(() => {
    return (profile.completedToday || []).length;
  }, [profile.completedToday]);

  const completionRatio = totalRituals > 0 ? (completedTodayCount / totalRituals) * 100 : 0;
  const strokeDashoffset = circumference - (completionRatio / 100) * circumference;

  const renderSection = (title, items, sectionLabel) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-4">
        <div className="border-b border-hairline pb-2 select-none">
          <Label variant="violet">{sectionLabel}</Label>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const isCompleted = (profile.completedToday || []).includes(item.id);
            const isExpanded = expandedId === item.id;
            return (
              <Card
                key={item.id}
                onClick={() => handleCardTap(item.id)}
                className={`transition-all select-none duration-150 relative cursor-pointer p-4
                  ${isCompleted ? "bg-violet/5 border-violet/20" : "bg-surface border-hairline hover:border-violet/40"}`}
              >
                <div className="flex items-start justify-between space-x-3">
                  {/* Left Column: Checkbox */}
                  <div
                    onClick={(e) => handleToggleHabit(item.id, e)}
                    className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 cursor-pointer rounded-sm
                      ${isCompleted 
                        ? "border-violet bg-violet text-white" 
                        : "border-graymuted/50 bg-transparent hover:border-violet"
                      }`}
                  >
                    {isCompleted && (
                      <svg className="w-3.5 h-3.5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Middle Column: Text */}
                  <div className="flex-1">
                    <p className="font-display font-bold text-xs tracking-wide text-ink">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-graymuted mt-0.5">{item.meta}</p>
                  </div>

                  {/* Right Column: Toggle Icon */}
                  <div className="text-graymuted p-0.5">
                    <svg
                      className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expandable How-To Section */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-hairline/60 text-[11px] text-graymuted leading-relaxed font-body animate-fade-rise">
                    <span className="font-display font-bold text-[9px] tracking-widest text-neon block mb-1">
                      GUIDED METHOD
                    </span>
                    {item.howTo}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col bg-transparent animate-fade-rise h-[calc(100vh-190px)] overflow-hidden">
      <TopBar title="Glow Journey Maintenance" subtitle="Maintain your Style DNA coordinates" />

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden flex-1 min-h-0">
        
        {/* Left Sidebar Panel: Streaks & Badges (Sticky) */}
        <div className="lg:col-span-4 space-y-6 lg:h-full flex flex-col overflow-y-auto scrollbar-none pb-4 pr-1 flex-shrink-0">
          
          {/* Style DNA Core persistent card */}
          <StyleDNACard layout="sidebar" />

          {/* Badges Gallery List */}
          <Card className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col justify-between bg-gradient-to-tr from-surface to-surface/70 border-hairline">
            <div className="flex justify-between items-center border-b border-hairline pb-3 select-none">
              <Label variant="cyan">Medals Unlocked</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto scrollbar-none pr-1">
              {badgesList.map((badge) => {
                const isEarned = (profile.badges || []).includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center justify-center p-3 border text-center transition-all select-none rounded-lg hover:scale-[1.03] duration-200
                      ${isEarned 
                        ? "bg-base border-violet/40 text-ink shadow-glow-violet/10 animate-soft-pulse" 
                        : "bg-base/20 border-dashed border-hairline opacity-40 text-graymuted"
                      }`}
                    title={badge.requirement}
                  >
                    <span className={`text-2xl mb-1 ${isEarned ? "" : "grayscale"}`}>
                      {badge.icon}
                    </span>
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-ink">
                      {badge.name}
                    </span>
                    <span className="text-[8px] text-graymuted mt-0.5 leading-none font-body">
                      {badge.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Content Panel: Scrollable morning/evening/weekly routines */}
        <div className="lg:col-span-8 h-full overflow-y-auto pr-2 scrollbar-none pb-24 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {renderSection("Morning", rituals.morning, "Morning Routine")}
            {renderSection("Evening", rituals.evening, "Evening Routine")}
            {renderSection("Weekly", rituals.weekly, "Weekly Maintenance")}
          </div>
        </div>

      </div>
    </div>
  );
}
export default Ritual;
