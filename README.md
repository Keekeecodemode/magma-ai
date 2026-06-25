# MAGMA.AI — "Be Magnetic"

An AI-powered glow-up companion that discovers your perfect style, builds your daily ritual, and connects you to the right specialist — without ever scoring your face.

> **Duolingo for beauty and grooming.**

---

## 1. Problem Statement
Looksmaxxing and glow-up culture have exploded across India, but existing applications either score your face against Western beauty standards (Umax, Looksmax) or simply book a salon appointment (Urban Company, Lakme). Nobody connects AI-driven style discovery, daily habit building, and trusted professional booking into one consistent, judgment-free journey — especially not for Indian users, hair types, and skin tones.

**MAGMA.AI** is designed to bridge this gap. We focus on amplifying your existing features. No scoring, no facial ratios, no judgment. 

---

## 2. Core Features

### ✦ AI Style Match (Hero Feature)
Powered by **Gemini 2.0 Flash**, this feature allows you to upload a selfie to analyze your face shape and hair texture. It identifies your best-suited hairstyles (such as textured crops or fades for men; wolf cuts or curtain bangs for women) and highlights your naturally magnetic features. 
*Privacy is paramount: all analysis happens instantly in the client and photos are never saved.*

### ✦ Daily Glow Ritual + Streaks
A customized habit-building dashboard (morning, evening, and weekly) that adapts to your age, skin profile (Oily/Dry/Combination/Normal), and hair texture. Tick off habits like double cleansing, lymphatic face massages, or hair oiling to grow your daily streak and earn milestone badges (Consistent 🔥, Glowing ✨, Magnetic AF 💎).

### ✦ Salon Finder (Bangalore)
Integrates style discovery with real bookings. If you discover a hairstyle like a "Wolf Cut" during your Style Match, click "Find Salons" to view Bangalore salons filtered by style specialty (e.g. Koramangala's K-beauty cuts, Whitefield's textured crops, etc.).

### ✦ AI Beauty Coach Chat
A warm, Claude-powered beauty coach that answers your custom grooming questions within 4 sentences, emphasizing natural feature amplification and traditional Indian remedies (neem, coconut oil, turmeric, amla).

---

## 3. Tech Stack
- **Framework**: React + Vite (Single Page App)
- **Styling**: Tailwind CSS (v3 with a custom editorial dark brand color palette)
- **Routing**: React Router DOM (v6)
- **APIs**: Client-side integrations with **Anthropic Messages API (Claude)** and **Google Gemini API**.

---

## 4. Brand Design Tokens
- **Ink** (`#080808`): Deep editorial background
- **Surface** (`#0F0A07`): Secondary background / bars
- **Card** (`#150E09`): Elevated card surfaces
- **Border** (`#1E1410`): Hairline dividers
- **Ember** (`#C1440E`): Primary accent buttons and active tabs
- **Spark** (`#FF6B35`): Micro-animations and particles highlights
- **Gold** (`#D4A853`): Earned badges and completed streaks
- **Bone** (`#F5F0E8`): Primary text

*Major layout containers utilize **sharp, border-radius-free edges** and left ember borders to emphasize an expensive, premium editorial look.*

---

## 5. Local Setup Instructions

1. Clone or navigate to the directory:
   ```bash
   cd C:\Users\Keekee\.gemini\antigravity\scratch\magma-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Paste your API keys:
     ```env
     VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 6. Security Tradeoff Disclaimer
> [!IMPORTANT]
> **API Key Disclosure:** Direct browser-to-API calls (client-side calls) expose your API keys in the network inspection tab of the browser. This setup is chosen for hackathon speed and simplicity. For a production deployment, these calls should be routed through a server or serverless proxy (such as a Vercel Serverless Function) to keep keys securely server-side.
