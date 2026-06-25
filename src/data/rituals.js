export const badgeDefinitions = {
  consistent: {
    id: "consistent",
    icon: "🔥",
    name: "Consistent",
    description: "7 Day Streak",
    requirement: "Maintain a 7-day habit completion streak.",
  },
  glowing: {
    id: "glowing",
    icon: "✨",
    name: "Glowing",
    description: "14 Day Streak",
    requirement: "Maintain a 14-day habit completion streak.",
  },
  magnetic_af: {
    id: "magnetic_af",
    icon: "💎",
    name: "Magnetic AF",
    description: "30 Day Streak",
    requirement: "Maintain a 30-day habit completion streak.",
  },
  self_care: {
    id: "self_care",
    icon: "💆",
    name: "Self Care Master",
    description: "10 Rituals Completed",
    requirement: "Complete a total of 10 individual daily rituals.",
  },
};

export function getRitualForProfile(profile) {
  const { age = 22, skinType = "Normal", hairType = "Straight" } = profile || {};
  
  // Custom copy variables
  let skinTip = "your skin type";
  let spfTip = "Broad-spectrum SPF 30+";
  let moisturizerTip = "Moisturizer";
  let oilTip = "Lightweight oil";
  
  if (skinType === "Oily") {
    skinTip = "excess sebum and target acne-prone zones";
    spfTip = "Matte, non-comedogenic gel SPF 50";
    moisturizerTip = "Oil-free gel moisturizer with Niacinamide";
  } else if (skinType === "Dry") {
    skinTip = "dryness and support your natural skin barrier";
    spfTip = "Dewy, hydrating sunscreen cream";
    moisturizerTip = "Rich barrier cream with Ceramides and Hyaluronic Acid";
  } else if (skinType === "Combination") {
    skinTip = "the T-zone shine while nourishing dry cheeks";
    spfTip = "Fluid lightweight sunscreen";
    moisturizerTip = "Balanced lotion, concentrating richness on the outer cheeks";
  } else if (skinType === "Normal") {
    skinTip = "hydration and maintain a balanced, bright complexion";
    spfTip = "Daily hydrating fluid SPF";
    moisturizerTip = "Standard nourishing lotion";
  }
  
  if (hairType === "Curly" || hairType === "Coily") {
    oilTip = "Rich Coconut, Argan, or Rosemary oil to lock in curls and soothe scalp";
  } else if (hairType === "Wavy") {
    oilTip = "Lightweight Jojoba or Almond oil to smooth waves without weighing them down";
  } else {
    oilTip = "Nourishing Sesame or Coconut oil for sleek, shiny strands";
  }

  const isTeen = age < 20;
  const isSenior = age > 45;
  const ageSpecificNote = isTeen 
    ? "Perfect for young, active skin to prevent early breakouts and UV damage."
    : isSenior
    ? "Essential for mature skin cells to lock in deep moisture and promote elasticity."
    : "Maintains optimal skin cell turnover and consistent hydration.";

  return {
    morning: [
      {
        id: "m_massage",
        name: "Lymphatic Face Massage",
        meta: "2 mins • De-puff & Sculpt",
        howTo: "Use 3 drops of facial oil or during cleansing. Using your knuckles or a Gua Sha, sweep upwards and outwards from your jawline to your ears. This stimulates blood flow, reduces morning puffiness, and gives a natural lift. " + ageSpecificNote,
      },
      {
        id: "m_spf",
        name: "Precision SPF Shield",
        meta: `1 min • Prevent UV Aging • For ${skinType} Skin`,
        howTo: `Apply two fingers worth of ${spfTip}. Dot it evenly across your face, neck, and ears. Blend gently. Sun protection is the single most effective anti-aging step you can perform.`,
      },
      {
        id: "m_hydration",
        name: "Morning Hydration Kick",
        meta: "1 min • Internal Glow",
        howTo: "Drink 500ml of warm water, optionally with a squeeze of fresh lemon. After a night of sleep, your body is dehydrated. Rehydrating first thing kicks off metabolic activity and flushes toxins for clear skin.",
      },
    ],
    evening: [
      {
        id: "e_cleanse",
        name: "Double Cleanse",
        meta: `3 mins • Remove SPF & Grime • Target ${skinType} profile`,
        howTo: `First, use a micellar water or cleansing oil to dissolve sunscreen and environmental pollutants. Follow with a gentle foaming or cream cleanser tailored to ${skinTip}. Rinse with lukewarm water.`,
      },
      {
        id: "e_scalp",
        name: "Invigorating Scalp Massage",
        meta: `3 mins • Promote Hair Growth • For ${hairType} Hair`,
        howTo: `Using the pads of your fingers (never your nails), apply firm but gentle circular pressure across your scalp. Start from the front hairline and move to the crown and neck. This increases blood flow to hair follicles to stimulate growth.`,
      },
      {
        id: "e_moisture",
        name: "Barrier Reset Moisturizer",
        meta: "2 mins • Night Recovery",
        howTo: `Apply a dime-sized amount of ${moisturizerTip}. Pat gently into the skin. Night is when your skin does its active recovery work, making high-quality hydration crucial.`,
      },
    ],
    weekly: [
      {
        id: "w_oil",
        name: "Scalp & Hair Oiling",
        meta: `20 mins • Deep Nourishment • Recommended for ${hairType} textures`,
        howTo: `Warm up 1-2 tablespoons of ${oilTip}. Part your hair in sections and apply directly to the scalp. Massage for 5 minutes, then run the remaining oil through the lengths. Leave on for at least 30 minutes before shampooing.`,
      },
      {
        id: "w_mask",
        name: "Detox/Nourish Face Mask",
        meta: `15 mins • Weekly Reset • Tailored for ${skinType} Skin`,
        howTo: skinType === "Oily" || skinType === "Combination"
          ? "Apply a thin layer of Kaolin clay or Neem & Turmeric mask on the T-zone. Leave for 10-15 minutes until dry, then rinse. This draws out deeply lodged sebum and soot."
          : "Apply a rich, hydrating honey or Aloe Vera cream mask. Leave for 15 minutes to allow skin to absorb natural moisturizers, then wipe clean with a damp cloth.",
      },
    ],
  };
}
