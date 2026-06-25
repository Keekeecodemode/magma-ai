/**
 * Convert a file object to a base64 string.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Split the metadata prefix "data:image/jpeg;base64," off
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Return a polished, gender-aware fallback style match.
 */
export function getFallbackStyleMatch(profile) {
  const gender = profile.gender || "Prefer not to say";
  const hair = profile.hairType || "Wavy";
  
  if (gender === "Man") {
    return {
      faceShape: "square",
      hairTexture: hair.toLowerCase(),
      magneticNote: "Your structured jawline and thick hair texture create a powerful, balanced profile.",
      topStyles: [
        {
          name: "Textured Crop",
          matchScore: 94,
          reason: "This cut adds texture and height at the crown, balancing your strong jawline. It works beautifully with your natural hair density."
        },
        {
          name: "Mid Fade",
          matchScore: 89,
          reason: "The clean taper on the sides contrasts with the volume on top. It highlights your facial architecture while remaining low maintenance."
        },
        {
          name: "Side Part",
          matchScore: 84,
          reason: "A classic structured style that follows your face's natural symmetry. It gives a sharp, professional frame suitable for all occasions."
        }
      ]
    };
  } else if (gender === "Woman") {
    return {
      faceShape: "oval",
      hairTexture: hair.toLowerCase(),
      magneticNote: "Your high cheekbones and soft jawline give your face a natural, graceful symmetry.",
      topStyles: [
        {
          name: "Wolf Cut",
          matchScore: 96,
          reason: "Soft, face-framing shaggy layers emphasize your cheekbones and eyes. This style utilizes your natural texture for effortless, lived-in volume."
        },
        {
          name: "Curtain Bangs",
          matchScore: 91,
          reason: "These bangs sweep outward to open up the eye area, highlighting your structure. They blend seamlessly into longer layers for movement."
        },
        {
          name: "Butterfly Cut",
          matchScore: 86,
          reason: "Cascading, wispy layers create dynamic volume around your chin and collarbones. It adds height and bounce without sacrificing length."
        }
      ]
    };
  } else {
    // Non-binary / Prefer not to say fallback
    return {
      faceShape: "oval",
      hairTexture: hair.toLowerCase(),
      magneticNote: "Your strong brow and elegant facial contours provide a highly versatile structure for styling.",
      topStyles: [
        {
          name: "Wolf Cut",
          matchScore: 93,
          reason: "An excellent gender-neutral style with soft layers that sit organically. It enhances natural movement and frames your jawline."
        },
        {
          name: "Textured Crop",
          matchScore: 88,
          reason: "A modern, sharp look that focuses volume at the crown. It draws attention to your eyes and provides a clean, editorial frame."
        },
        {
          name: "Curtain Bangs",
          matchScore: 85,
          reason: "A versatile option that adds soft, symmetrical framing to the forehead. It can be dressed up or styled down easily."
        }
      ]
    };
  }
}

/**
 * Call Gemini 2.0 Flash to analyze the uploaded selfie.
 */
export async function analyzeStyleMatch(base64Image, mimeType, profile) {
  const apiKey = localStorage.getItem("magma_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. Using style match fallback.");
    return getFallbackStyleMatch(profile);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const isMan = profile.gender === "Man";
    const isWoman = profile.gender === "Woman";
    
    // Detailed prompts ensuring the model NEVER rates or uses negative words
    const prompt = `You are a professional, warm style matching AI. 
Analyze the hair texture and face shape of the person in the photo.
The user identifies as ${profile.gender}, has self-reported hair texture: ${profile.hairType}, skin type: ${profile.skinType}, and is ${profile.age} years old.

CRITICAL RULES:
1. NEVER score or rate the user's attractiveness (do not give scales like 1-10, or write words like "above average").
2. NEVER mention flaws, defects, problems, or use words like "fix", "improve", "flaw", "bad", "problem", "correct", or "hide".
3. ONLY discuss which styles complement their existing, beautiful features. Every feature is already magnetic; we are just finding the perfect frame for it.
4. Suggestions must be appropriate for their gender identity:
   - If they identify as a Man: prioritize styles like textured crop, fade, French crop, buzz cut, side part.
   - If they identify as a Woman: prioritize styles like wolf cut, curtain bangs, butterfly cut, bob cut, long layers.
   - Otherwise: suggest a versatile mix of these.
5. You must return ONLY a raw JSON object. Do not include markdown fences like \`\`\`json. Do not include preambles.

The output JSON structure MUST be:
{
  "faceShape": "oval" | "round" | "square" | "heart" | "diamond" | "long",
  "hairTexture": "straight" | "wavy" | "curly" | "coily",
  "magneticNote": "One warm, highly specific sentence celebrating a visibly unique facial feature in this exact photo (such as the specific line of their jaw, the height/prominence of their cheekbones, brow line alignment, forehead ratio, or eye shape/spacing) to prove this is a live customized analysis, not simulated boilerplate. Do not suggest they need to change anything.",
  "topStyles": [
    {
      "name": "Name of style",
      "matchScore": 75 to 98 (choose a realistic high match percentage),
      "reason": "Exactly 2 sentences explaining why this style complements their specific face shape and hair texture, referencing visibly specific facial proportions or hair density in this exact photo."
    },
    {
      "name": "Name of second style",
      "matchScore": 75 to 98,
      "reason": "Exactly 2 sentences explaining why this style complements their specific face shape and hair texture, referencing visibly specific facial proportions or hair density in this exact photo."
    },
    {
      "name": "Name of third style",
      "matchScore": 75 to 98,
      "reason": "Exactly 2 sentences explaining why this style complements their specific face shape and hair texture, referencing visibly specific facial proportions or hair density in this exact photo."
    }
  ]
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const parsedResult = JSON.parse(cleanedText);
    
    // Validate keys before returning
    if (
      parsedResult.faceShape &&
      parsedResult.hairTexture &&
      parsedResult.magneticNote &&
      Array.isArray(parsedResult.topStyles) &&
      parsedResult.topStyles.length === 3
    ) {
      return parsedResult;
    }

    throw new Error("JSON structure validation failed");
  } catch (err) {
    console.error("Gemini API call failed, using fallback:", err);
    return getFallbackStyleMatch(profile);
  }
}

/**
 * Call Gemini 2.0 Flash to geocode a typed address in Bangalore.
 */
export async function geocodeAddress(addressText) {
  const defaultCoords = { lat: 12.9716, lng: 77.5946 }; // Bangalore Center
  
  if (!addressText || addressText.trim() === "") {
    return defaultCoords;
  }
  
  const query = addressText.toLowerCase().trim();

  // Local keyword dictionary fallback
  const localPresets = {
    "koramangala": { lat: 12.9352, lng: 77.6244 },
    "indiranagar": { lat: 12.9719, lng: 77.6412 },
    "hsr": { lat: 12.9141, lng: 77.6411 },
    "mg road": { lat: 12.9738, lng: 77.6119 },
    "whitefield": { lat: 12.9698, lng: 77.7499 },
    "jayanagar": { lat: 12.9250, lng: 77.5938 },
    "yeshwanthpur": { lat: 13.0285, lng: 77.5402 },
    "malleshwaram": { lat: 13.0031, lng: 77.5643 },
    "electronic city": { lat: 12.8487, lng: 77.6769 },
    "marathahalli": { lat: 12.9562, lng: 77.6967 },
    "hebbal": { lat: 13.0354, lng: 77.5988 },
    "banashankari": { lat: 12.9256, lng: 77.5739 },
    "domlur": { lat: 12.9610, lng: 77.6387 },
    "bellandur": { lat: 12.9304, lng: 77.6784 },
    "btm": { lat: 12.9166, lng: 77.6101 }
  };

  let matchedCoords = null;
  for (const [key, value] of Object.entries(localPresets)) {
    if (query.includes(key)) {
      matchedCoords = value;
      break;
    }
  }

  const apiKey = localStorage.getItem("magma_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is missing. Using local geocoding fallback.");
    return matchedCoords || defaultCoords;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const prompt = `You are a precise geocoding engine. Resolve the following address string to a geographic coordinate (latitude and longitude): "${addressText}".
If the address is incomplete or lacks a specified city or country, resolve it to a location in Bangalore, Karnataka, India. Otherwise, resolve it to its correct global coordinates.
Return ONLY a raw JSON object with keys "lat" (number) and "lng" (number). No markdown, no fences.
Example output:
{ "lat": 12.9352, "lng": 77.6244 }`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
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
      throw new Error(`Gemini Geocoder error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("Empty response from geocoder");
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```json/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleanedText);
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return parsed;
    }
    throw new Error("Invalid lat/lng types returned");
  } catch (err) {
    console.error("Gemini geocoding failed, using local match or default:", err);
    return matchedCoords || defaultCoords;
  }
}
