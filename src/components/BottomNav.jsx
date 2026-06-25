import React from "react";
import { NavLink } from "react-router-dom";

export function BottomNav() {
  const tabs = [
    {
      path: "/home",
      label: "Home",
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-ember" : "text-muted"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/ritual",
      label: "Ritual",
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-ember" : "text-muted"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      path: "/style",
      label: "Style",
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-ember" : "text-muted"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      path: "/salons",
      label: "Salons",
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-ember" : "text-muted"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-ember" : "text-muted"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="w-full max-w-[480px] bg-surface border-t border-border fixed bottom-0 z-50 flex items-center justify-around py-3">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 select-none transition-colors duration-200 py-1 px-3 ${
              isActive ? "text-ember" : "text-muted hover:text-bone"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {tab.icon(isActive)}
              <span className="text-[10px] font-display font-medium uppercase tracking-wider">
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
export default BottomNav;
