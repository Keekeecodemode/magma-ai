import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Screen } from "./components/ui";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Splash } from "./screens/Splash";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { Ritual } from "./screens/Ritual";
import { StyleMatch } from "./screens/StyleMatch";
import { SalonFinder } from "./screens/SalonFinder";
import { Coach } from "./screens/Coach";
import { Profile } from "./screens/Profile";

function AppContent() {
  const location = useLocation();

  // Hide Navbar/Footer on Splash ("/") and Onboarding ("/onboarding/...")
  const isSplash = location.pathname === "/";
  const isOnboarding = location.pathname.startsWith("/onboarding");
  const hideNav = isSplash || isOnboarding;

  return (
    <Screen>
      {!hideNav && <Navbar />}
      <div className="flex-1 flex flex-col w-full relative mt-6 min-h-[520px] overflow-y-auto scrollbar-none">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding/:step" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ritual" element={<Ritual />} />
          <Route path="/style" element={<StyleMatch />} />
          <Route path="/salons" element={<SalonFinder />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/profile" element={<Profile />} />
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!hideNav && <Footer />}
    </Screen>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
