export const salons = [
  {
    id: "mirrors",
    name: "Mirrors Unisex Salon",
    area: "Koramangala",
    rating: 4.8,
    priceLevel: 3,
    specialties: ["Hair", "Korean", "Wolf Cut", "Curtain Bangs", "Butterfly Cut"],
    tagline: "Precision styling and avant-garde K-beauty cuts.",
    bestFor: "Korean wolf cuts, curtain bangs, and advanced layering.",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    lat: 12.9352,
    lng: 77.6244,
    reviews: [
      { author: "Rohan M.", text: "The stylist here mastered my wolf cut perfectly. Extremely professional staff!", rating: 5 },
      { author: "Aditi S.", text: "Excellent K-beauty layered styles. Highly recommend for signature trends.", rating: 4.8 }
    ]
  },
  {
    id: "green-trends",
    name: "Green Trends",
    area: "Indiranagar",
    rating: 4.2,
    priceLevel: 1,
    specialties: ["Budget", "Hair", "Straight", "Wavy", "Curly", "Coily"],
    tagline: "Affordable grooming for every hair type and texture.",
    bestFor: "Budget-friendly everyday haircuts and standard maintenance trims.",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80",
    lat: 12.9719,
    lng: 77.6412,
    reviews: [
      { author: "Vikram K.", text: "Affordable, quick, and the staff is friendly. Good value for money.", rating: 4.0 },
      { author: "Priya R.", text: "Standard trim done very well. Best budget option in Indiranagar.", rating: 4.4 }
    ]
  },
  {
    id: "naturals",
    name: "Naturals Salon",
    area: "HSR Layout",
    rating: 4.5,
    priceLevel: 2,
    specialties: ["Skin", "Bridal", "Oily", "Dry", "Combination", "Normal"],
    tagline: "India's favorite destination for healthy, radiant skin.",
    bestFor: "Custom skin hydration packages and bridal makeovers.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    lat: 12.9141,
    lng: 77.6411,
    reviews: [
      { author: "Sneha G.", text: "Got their glow facial and it completely refreshed my dry skin. Great products.", rating: 4.6 },
      { author: "Karan P.", text: "Helpful skin advice and very clean setup. Happy with the routine they suggested.", rating: 4.4 }
    ]
  },
  {
    id: "toni-guy",
    name: "Toni & Guy",
    area: "MG Road",
    rating: 4.9,
    priceLevel: 3,
    specialties: ["Premium", "Color", "International", "Long Layers", "Bob Cut"],
    tagline: "World-class fashion styling and premium hair transformations.",
    bestFor: "Premium global hair coloring, high-fashion styles, and bob cuts.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    lat: 12.9738,
    lng: 77.6119,
    reviews: [
      { author: "Meera H.", text: "World-class hair coloring. The stylists are certified professionals and it shows.", rating: 5 },
      { author: "Rahul D.", text: "Incredible transformation. Premium service and premium aesthetics.", rating: 4.8 }
    ]
  },
  {
    id: "bounce",
    name: "Bounce Salon",
    area: "Whitefield",
    rating: 4.7,
    priceLevel: 3,
    specialties: ["Men", "Fade", "Beard", "Textured Crop", "Buzz Cut", "French Crop", "Side Part"],
    tagline: "Contemporary male styling, sharp fades, and beard architecture.",
    bestFor: "Sharp skin fades, beard shape-ups, and contemporary men's crop cuts.",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    lat: 12.9698,
    lng: 77.7499,
    reviews: [
      { author: "Amit S.", text: "Hands down the best place in Whitefield for a clean fade and beard trim.", rating: 4.8 },
      { author: "John D.", text: "Professional men's styling. They know exactly how to shape textured hair.", rating: 4.6 }
    ]
  },
  {
    id: "studio-jj",
    name: "Studio JJ",
    area: "Jayanagar",
    rating: 4.4,
    priceLevel: 1,
    specialties: ["Budget", "Hair", "Skin", "Cleanse"],
    tagline: "Neighborhood favorites with uncompromising hygiene and value.",
    bestFor: "Quick cleanups, standard trims, and basic scalp care.",
    imageUrl: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=600&q=80",
    lat: 12.9250,
    lng: 77.5938,
    reviews: [
      { author: "Nikhil T.", text: "Very hygienic and affordable. Excellent options for monthly maintenance.", rating: 4.5 },
      { author: "Aisha M.", text: "Simple, efficient, and pocket-friendly scalp care.", rating: 4.3 }
    ]
  }
];

export function filterSalonsByStyle(styleName) {
  if (!styleName) return salons;
  
  const query = styleName.toLowerCase().trim();
  
  const filtered = salons.filter((salon) =>
    salon.specialties.some((specialty) => specialty.toLowerCase().includes(query)) ||
    salon.name.toLowerCase().includes(query) ||
    salon.tagline.toLowerCase().includes(query)
  );

  return filtered.length > 0 ? filtered : salons;
}
