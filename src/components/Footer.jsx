import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-hairline/60 pt-6 mt-8 flex items-center justify-between text-[9px] text-graymuted font-body font-medium select-none flex-shrink-0">
      <div>
        © {new Date().getFullYear()} MAGMA.AI
      </div>
      <div className="flex space-x-6">
        <a href="#help" className="hover:text-ink transition-colors uppercase tracking-wider">Help Center</a>
        <a href="#privacy" className="hover:text-ink transition-colors uppercase tracking-wider">Privacy Policy</a>
        <a href="#terms" className="hover:text-ink transition-colors uppercase tracking-wider">Terms of Service</a>
      </div>
    </footer>
  );
}
export default Footer;
