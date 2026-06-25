import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../lib/profileStore";
import { PrimaryButton, Card, Label } from "../components/ui";

const STEPS = ["name", "age", "gender", "hair", "skin", "ready"];

export function Onboarding() {
  const { step } = useParams();
  const navigate = useNavigate();
  
  // Local state initialized from profile store
  const [draft, setDraft] = useState(() => getProfile());

  useEffect(() => {
    // If the step is not valid, redirect to the first step
    if (!STEPS.includes(step)) {
      navigate(`/onboarding/${STEPS[0]}`, { replace: true });
    }
  }, [step, navigate]);

  const stepIndex = STEPS.indexOf(step);
  const progressPercent = ((stepIndex + 1) / STEPS.length) * 100;

  const handleUpdate = (field, value) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      // Sync into profile storage draft state (without setting onboarded: true yet)
      updateProfile({ [field]: value });
      return next;
    });
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      navigate(`/onboarding/${STEPS[stepIndex + 1]}`);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      navigate(`/onboarding/${STEPS[stepIndex - 1]}`);
    }
  };

  const finishOnboarding = () => {
    updateProfile({ onboarded: true });
    navigate("/home");
  };

  const isNextDisabled = () => {
    if (step === "name") return !draft.name || draft.name.trim() === "";
    return false;
  };

  const renderStepContent = () => {
    switch (step) {
      case "name":
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <Label variant="violet">01. Identity</Label>
              <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
                What's your name?
              </h2>
              <p className="text-sm text-graymuted">
                Your styling companion needs a name to address you.
              </p>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => handleUpdate("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-base border border-hairline py-4 px-5 text-ink font-body placeholder:text-graymuted focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors rounded-lg"
                autoFocus
              />
            </div>
            <div className="pt-8">
              <PrimaryButton onClick={handleNext} disabled={isNextDisabled()} className="w-full">
                Continue
              </PrimaryButton>
            </div>
          </div>
        );

      case "age":
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <Label variant="violet">02. Lifecycle</Label>
              <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
                How old are you?
              </h2>
              <p className="text-sm text-graymuted">
                We personalize your daily routines, hydration levels, and hair suggestions based on your age.
              </p>
              
              <div className="py-6 flex flex-col items-center">
                <div className="font-display font-black text-6xl text-violet leading-none select-none">
                  {draft.age}
                  <span className="text-graymuted text-sm font-medium ml-1">yrs</span>
                </div>
                
                <input
                  type="range"
                  min="13"
                  max="65"
                  value={draft.age}
                  onChange={(e) => handleUpdate("age", parseInt(e.target.value))}
                  className="w-full h-1 bg-hairline appearance-none cursor-pointer mt-8 accent-violet"
                />
                <div className="w-full flex justify-between text-[10px] text-graymuted font-display mt-2">
                  <span>13 YRS</span>
                  <span>65 YRS</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-8">
              <button 
                onClick={handleBack}
                className="border border-hairline text-graymuted hover:text-ink hover:bg-base px-6 py-3.5 active:scale-[0.97] transition-all rounded-lg text-xs font-display font-bold uppercase tracking-wider"
              >
                Back
              </button>
              <PrimaryButton className="flex-1" onClick={handleNext}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        );

      case "gender":
        const genders = ["Woman", "Man", "Non-binary", "Prefer not to say"];
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <Label variant="violet">03. Profile</Label>
              <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
                Your Gender Identity
              </h2>
              <p className="text-sm text-graymuted">
                Help us discover style recommendation models that fit your preferences.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleUpdate("gender", g)}
                    className={`p-4 text-center font-body text-xs font-bold border transition-all rounded-lg select-none
                      ${draft.gender === g
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-hairline bg-transparent text-graymuted hover:border-graymuted hover:text-ink"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-8">
              <button 
                onClick={handleBack}
                className="border border-hairline text-graymuted hover:text-ink hover:bg-base px-6 py-3.5 active:scale-[0.97] transition-all rounded-lg text-xs font-display font-bold uppercase tracking-wider"
              >
                Back
              </button>
              <PrimaryButton className="flex-1" onClick={handleNext}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        );

      case "hair":
        const hairTypes = [
          { name: "Straight", desc: "No natural curve, lays flat easily." },
          { name: "Wavy", desc: "Gentle S-shape bends, natural volume." },
          { name: "Curly", desc: "Defined loops, springy rings, frizzy." },
          { name: "Coily", desc: "Tight corkscrews, highly textured." },
        ];
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <Label variant="violet">04. Texture</Label>
              <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
                Your Hair Type
              </h2>
              <p className="text-sm text-graymuted">
                Different hair structures need entirely unique care routines and styling.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {hairTypes.map((ht) => (
                  <button
                    key={ht.name}
                    onClick={() => handleUpdate("hairType", ht.name)}
                    className={`p-4 text-left border transition-all rounded-lg select-none flex flex-col justify-between h-24
                      ${draft.hairType === ht.name
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-hairline bg-transparent text-graymuted hover:border-graymuted"
                      }`}
                  >
                    <span className="font-display font-bold text-xs tracking-wide text-ink">
                      {ht.name}
                    </span>
                    <span className="text-[10px] text-graymuted mt-1 leading-normal">
                      {ht.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-8">
              <button 
                onClick={handleBack}
                className="border border-hairline text-graymuted hover:text-ink hover:bg-base px-6 py-3.5 active:scale-[0.97] transition-all rounded-lg text-xs font-display font-bold uppercase tracking-wider"
              >
                Back
              </button>
              <PrimaryButton className="flex-1" onClick={handleNext}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        );

      case "skin":
        const skinTypes = [
          { name: "Oily", desc: "Shiny look, visible pores, grease." },
          { name: "Dry", desc: "Flaky spots, tight feel, dull." },
          { name: "Combination", desc: "Oily T-zone, dry cheeks." },
          { name: "Normal", desc: "Balanced hydration, few breakouts." },
        ];
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              <Label variant="violet">05. Canvas</Label>
              <h2 className="font-display font-extrabold text-3xl text-ink leading-tight">
                Your Skin Type
              </h2>
              <p className="text-sm text-graymuted">
                Customizes your hydration steps and topical product applications.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {skinTypes.map((st) => (
                  <button
                    key={st.name}
                    onClick={() => handleUpdate("skinType", st.name)}
                    className={`p-4 text-left border transition-all rounded-lg select-none flex flex-col justify-between h-24
                      ${draft.skinType === st.name
                        ? "border-violet bg-violet/5 text-violet"
                        : "border-hairline bg-transparent text-graymuted hover:border-graymuted"
                      }`}
                  >
                    <span className="font-display font-bold text-xs tracking-wide text-ink">
                      {st.name}
                    </span>
                    <span className="text-[10px] text-graymuted mt-1 leading-normal">
                      {st.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-8">
              <button 
                onClick={handleBack}
                className="border border-hairline text-graymuted hover:text-ink hover:bg-base px-6 py-3.5 active:scale-[0.97] transition-all rounded-lg text-xs font-display font-bold uppercase tracking-wider"
              >
                Back
              </button>
              <PrimaryButton className="flex-1" onClick={handleNext}>
                Continue
              </PrimaryButton>
            </div>
          </div>
        );

      case "ready":
        return (
          <div className="space-y-6 flex-1 flex flex-col justify-between text-center max-w-sm mx-auto">
            <div className="space-y-6 my-auto pt-6">
              <div className="text-neon text-4xl leading-none select-none animate-pulse">✦</div>
              <h2 className="font-display font-black text-3xl text-ink leading-tight tracking-tight uppercase">
                YOU ARE ALREADY MAGNETIC.
              </h2>
              <div className="space-y-2">
                <p className="text-xs text-ink font-body font-semibold">
                  Style discovery, not judgment.
                </p>
                <p className="text-[11px] text-graymuted leading-relaxed font-body">
                  No beauty scores. No attractiveness ratings. MAGMA is built entirely to amplify your natural features.
                </p>
              </div>
              
              <div className="border border-hairline p-5 bg-base rounded-lg text-left shadow-sm">
                <p className="text-[9px] text-graymuted font-display font-bold uppercase tracking-widest text-center border-b border-hairline pb-2 mb-3">
                  Identity Credentials
                </p>
                <div className="text-xs space-y-2 text-ink font-body">
                  <div className="flex justify-between"><span>Name:</span> <span className="text-violet font-bold">{draft.name}</span></div>
                  <div className="flex justify-between"><span>Attributes:</span> <span className="text-graymuted">{draft.age}y • {draft.gender}</span></div>
                  <div className="flex justify-between"><span>DNA profiles:</span> <span className="text-graymuted">{draft.hairType} / {draft.skinType}</span></div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <PrimaryButton onClick={finishOnboarding} className="w-full" variant="neon">
                Begin My Journey
              </PrimaryButton>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-base min-h-screen flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden animate-fade-rise">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />

      {/* Main Dialog Container */}
      <div className="w-full max-w-xl bg-surface border border-hairline rounded-lg shadow-xl p-8 md:p-10 z-10 flex flex-col min-h-[500px]">
        {/* Step Progress line */}
        {step !== "ready" && (
          <div className="w-full bg-hairline h-1 rounded-full mb-8 relative select-none">
            <div
              className="bg-violet h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Content */}
        {renderStepContent()}
      </div>
    </div>
  );
}
export default Onboarding;
