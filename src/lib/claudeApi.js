import { getTodayString } from "./profileStore";
import { dermaFacts } from "../data/dermaFacts";

const CACHE_KEY = "magma_pulse_cache_v1";

const FALLBACK_COACH = "I'm here to help you amplify your natural features! Since we are refining your routine, I'd suggest rinsing with cold water in the morning, followed by a light splash of rose water to balance your skin's pH. It keeps things fresh without stripping your natural oils. How does your skin feel after cleansing usually?";

export function getMockDailyPulse(profile) {
  const skin = (profile.skinType || "Normal").toLowerCase();
  const hair = (profile.hairType || "Wavy").toLowerCase();
  
  let relevantFacts = [];
  if (skin === "oily" || skin === "combination") {
    relevantFacts = dermaFacts.filter(f => f.category === "actives" || f.category === "skin barrier" || f.category === "sun protection");
  } else if (skin === "dry") {
    relevantFacts = dermaFacts.filter(f => f.category === "skin barrier" || f.category === "sun protection");
  } else {
    relevantFacts = dermaFacts.filter(f => f.category === "sun protection" || f.category === "hair biology");
  }

  if (hair.includes("curly") || hair.includes("coily") || hair.includes("wavy")) {
    relevantFacts.push(...dermaFacts.filter(f => f.category === "hair biology"));
  }

  if (relevantFacts.length === 0) {
    relevantFacts = dermaFacts;
  }

  const todayNum = new Date().getDate();
  const selectedFact = relevantFacts[todayNum % relevantFacts.length];

  // Personalize a tip and affirmation based on the fact locally
  let tip = "Apply moisturizer to damp skin to lock in moisture.";
  let affirmation = "My skin is resilient and glowing.";

  if (selectedFact.category === "sun protection") {
    tip = `Since you have ${skin} skin, look for a lightweight, non-comedogenic daily SPF 30+ sunscreen to protect against UV damage.`;
    affirmation = "I protect my natural skin barrier and carry myself with confidence.";
  } else if (selectedFact.category === "skin barrier") {
    if (skin === "oily" || skin === "combination") {
      tip = "Avoid stripping your face with harsh scrubs; instead, wash gently twice daily to avoid triggering rebound oil production.";
    } else {
      tip = "Pat your face dry gently after washing and apply your hydration layers immediately while skin is still damp.";
    }
    affirmation = "I am in perfect balance with my body and routines.";
  } else if (selectedFact.category === "actives") {
    if (skin === "oily" || skin === "combination") {
      tip = "Try introducing a niacinamide serum into your morning routine to help naturally regulate oil and sebum production.";
    } else {
      tip = "Introduce chemical actives like retinoids slowly, starting twice a week, to allow your skin to build tolerance.";
    }
    affirmation = "I nurture my skin with care and patience.";
  } else if (selectedFact.category === "hair biology") {
    tip = `For your ${hair} hair, use a wide-tooth comb and massage your scalp gently for 2 minutes daily to stimulate circulation.`;
    affirmation = "My hair is a crown of natural, healthy volume.";
  }

  return {
    fact: selectedFact.fact,
    tip: tip,
    affirmation: affirmation,
    source: selectedFact.source
  };
}

export function getMockCoachReply(profile, message) {
  const msg = message.toLowerCase();
  const hair = (profile.hairType || "Wavy").toLowerCase();
  const skin = (profile.skinType || "Oily").toLowerCase();
  
  if (msg.includes("wolf cut") || msg.includes("wolfcut")) {
    return `Maintaining a Wolf Cut on ${hair} hair requires volume management. Focus on a lightweight leave-in conditioner to define the layers without weighing them down. Since your skin is ${skin}, rinse your face after styling to prevent any styling products from settling on your forehead and triggering breakouts.`;
  }
  if (msg.includes("morning routine") || msg.includes("morning")) {
    return `For a 5-minute morning routine tailored to your ${skin} skin and ${hair} hair: Start with a gentle foaming cleanser to remove excess overnight sebum. Apply a broad-spectrum SPF 50. For your hair, mist with a texturizing spray and style with a wide-tooth comb to preserve natural volume.`;
  }
  if (msg.includes("dull") || msg.includes("skin feels dull")) {
    return `Dullness is often caused by dead skin cell accumulation. Since you have ${skin} skin, a mild chemical exfoliant like salicylic acid or lactic acid twice a week will speed up turnover. Keep your hydration locked in with a gel-based moisturizer.`;
  }
  if (msg.includes("thin") || msg.includes("hair is thin")) {
    return `To amplify thin ${hair} hair, avoid heavy silicones or heavy oils that flatten the hair shafts. Use a clarifying shampoo weekly and apply a pea-sized amount of lightweight volume mousse at the roots while damp.`;
  }
  if (msg.includes("beard")) {
    return `For beard maintenance, wash twice a week with a sulfate-free beard shampoo. Since your skin is ${skin}, use a light argan-based beard oil to soften the hair without clogging the surrounding pores.`;
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return `Hello! I am your AI Beauty Coach. I've analyzed your Style DNA (${profile.hairType} hair & ${profile.skinType} skin). Ask me about specific cuts like the Wolf Cut, your daily skincare routine, or how to treat dullness!`;
  }
  
  return `Analyzing your query based on your ${profile.hairType} hair and ${profile.skinType} skin. For optimal styling, dermatological consensus recommends balancing sebum production through proper hydration. What specific styling or grooming concern can I help you resolve next?`;
}

/**
 * Get the daily pulse content. Caches results in localStorage to avoid multiple API calls on the same day.
 */
export async function getDailyPulse(profile) {
  const todayStr = getTodayString();
  
  // Check cache first
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (parsed.date === todayStr && parsed.pulse) {
        return parsed.pulse;
      }
    }
  } catch (e) {
    console.error("Error reading daily pulse cache:", e);
  }

  // Select a relevant fact from dermaFacts based on user attributes
  const skin = (profile.skinType || "Normal").toLowerCase();
  const hair = (profile.hairType || "Wavy").toLowerCase();
  
  let relevantFacts = [];
  if (skin === "oily" || skin === "combination") {
    relevantFacts = dermaFacts.filter(f => f.category === "actives" || f.category === "skin barrier" || f.category === "sun protection");
  } else if (skin === "dry") {
    relevantFacts = dermaFacts.filter(f => f.category === "skin barrier" || f.category === "sun protection");
  } else {
    relevantFacts = dermaFacts.filter(f => f.category === "sun protection" || f.category === "hair biology");
  }

  if (hair.includes("curly") || hair.includes("coily") || hair.includes("wavy")) {
    relevantFacts.push(...dermaFacts.filter(f => f.category === "hair biology"));
  }

  if (relevantFacts.length === 0) {
    relevantFacts = dermaFacts;
  }

  const todayNum = new Date().getDate();
  const selectedFact = relevantFacts[todayNum % relevantFacts.length];

  const apiKey = localStorage.getItem("magma_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. Using dynamic daily pulse fallback.");
    return getMockDailyPulse(profile);
  }

  try {
    const systemPrompt = `You are Magma.ai's beauty intelligence engine. You generate daily personalized content for a user.

Grounding rules:
- Use the EXACT fact provided in the user prompt. Do NOT change it, summarize it, or rewrite it. It must be returned word-for-word in the "fact" field.
- Write a natural, practical, 1-2 sentence tip grounded in this fact, personalized for the user's specific skin and hair type.
- Write 1 powerful, age-appropriate affirmation that makes them feel magnetic.
- Return the EXACT source provided in the user prompt in the "source" field.
- Never score, rate, or judge anyone's face or appearance.

Return ONLY a raw JSON object, no markdown fences, no preamble:
{
  "fact": "the exact fact provided in the prompt",
  "tip": "1-2 sentence personalized practical tip based on the fact",
  "affirmation": "1 powerful sentence",
  "source": "the exact source provided in the prompt"
}`;

    const userPrompt = `Generate a daily pulse based on this verified fact:
Fact: "${selectedFact.fact}"
Source: "${selectedFact.source}"

For a user with these attributes:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Hair Type: ${profile.hairType}
- Skin Type: ${profile.skinType}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("Empty response from Gemini API");
    }

    // Clean potential markdown wrap
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }
    
    const pulseResult = JSON.parse(cleanedContent);
    
    // Validate keys and force the exact fact and source
    if (pulseResult.tip && pulseResult.affirmation) {
      const finalResult = {
        fact: selectedFact.fact,
        tip: pulseResult.tip,
        affirmation: pulseResult.affirmation,
        source: selectedFact.source
      };
      // Save cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        date: todayStr,
        pulse: finalResult
      }));
      return finalResult;
    }
    
    throw new Error("Invalid JSON structure received from API");
  } catch (err) {
    console.error("Failed to fetch daily pulse from Gemini API, using local mock:", err);
    return getMockDailyPulse(profile);
  }
}
/**
 * Talk to the Gemini-powered AI beauty coach.
 */
export async function askCoach(profile, message, history = []) {
  const apiKey = localStorage.getItem("magma_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. Using dynamic beauty coach fallback.");
    return getMockCoachReply(profile, message);
  }

  try {
    const systemPrompt = `You are the Magma.ai Beauty Coach. You speak with warmth, confidence, and zero judgment.

Grounding rules:
- Base your guidance on mainstream dermatological and trichological consensus — established facts about skin barrier function, sebum/oil balance, hair growth cycles, UV protection, and basic ingredient science (e.g. retinoids, hyaluronic acid, salicylic acid, niacinamide).
- Do NOT cite specific named studies, journals, or invented statistics — you do not have the ability to verify a live citation, so do not claim one. Speak in terms of established consensus instead (e.g. 'dermatologists generally recommend' rather than 'a 2023 study found').
- Avoid fad or trend-driven claims not backed by real skin/hair science.
- Never say someone needs to 'fix' themselves. Always frame guidance as amplifying what they already have.
- Keep answers under 4 sentences, specific and actionable.
- Use Indian context naturally where relevant (coconut oil, rice water, neem, turmeric) only when genuinely useful, not forced, and only when there is real basis for the suggestion.
- Never tell them to 'see a doctor' — give practical guidance instead.
- You believe every person is already magnetic.

User profile — age ${profile.age}, gender ${profile.gender}, hair type ${profile.hairType}, skin type ${profile.skinType}.`;

    // Map history to Gemini message format
    const rawContents = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Add current message
    rawContents.push({ role: "user", parts: [{ text: message }] });

    // Clean up contents to adhere to Gemini constraints:
    // 1. Must alternate strictly between "user" and "model".
    // 2. Must start with "user".
    const mergedContents = [];
    for (const item of rawContents) {
      if (mergedContents.length > 0 && mergedContents[mergedContents.length - 1].role === item.role) {
        // Merge the text parts to preserve all conversation context
        mergedContents[mergedContents.length - 1].parts[0].text += "\n" + item.parts[0].text;
      } else {
        mergedContents.push({
          role: item.role,
          parts: [{ text: item.parts[0].text }]
        });
      }
    }

    // Now, ensure it starts with "user"
    while (mergedContents.length > 0 && mergedContents[0].role !== "user") {
      mergedContents.shift();
    }

    // Keep at most 8 messages (ensuring it starts with "user")
    let contents = mergedContents;
    if (contents.length > 8) {
      let startIdx = contents.length - 8;
      if (contents[startIdx].role !== "user") {
        startIdx++;
      }
      contents = contents.slice(startIdx);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error("Empty response from Gemini API");
    }

    return content.trim();
  } catch (err) {
    console.error("Failed to fetch coach response from Gemini API:", err);
    return getMockCoachReply(profile, message);
  }
}
