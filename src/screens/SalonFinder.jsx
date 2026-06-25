import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { salons, filterSalonsByStyle } from "../data/salons";
import { getProfile } from "../lib/profileStore";
import { Card, Label, TopBar, StyleDNACard } from "../components/ui";
import { geocodeAddress } from "../lib/geminiApi";
import { motion } from "framer-motion";

const CHIPS = [
  { id: "all", label: "All" },
  { id: "hair", label: "Hair" },
  { id: "skin", label: "Skin" },
  { id: "beard", label: "Beard" },
  { id: "bridal", label: "Bridal" },
  { id: "korean", label: "Korean" },
  { id: "budget", label: "Budget" },
  { id: "premium", label: "Premium" },
  { id: "men", label: "Men" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const getSalonThumbnail = (salon) => {
  const specs = salon.specialties.map(s => s.toLowerCase());
  if (specs.includes("skin") || specs.includes("facial")) {
    return "/images/selfcare_lifestyle.png";
  }
  if (specs.includes("hair") || specs.includes("wolf cut") || specs.includes("fade")) {
    return "/images/hair_crop.png";
  }
  return "/images/salon_hero.png";
};

export function SalonFinder() {
  const [searchParams] = useSearchParams();
  const styleQuery = searchParams.get("style") || "";

  const [activeChip, setActiveChip] = useState("all");
  const [bookingMessage, setBookingMessage] = useState("");
  const [userLocation, setUserLocation] = useState("Bangalore Center");
  const [userCoords, setUserCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [locationStatus, setLocationStatus] = useState("default"); // 'default', 'detecting', 'success', 'denied'
  const [sortBy, setSortBy] = useState("nearest"); // 'nearest' or 'rating'
  
  const [activeRoute, setActiveRoute] = useState(null);
  const [bookingState, setBookingState] = useState("idle"); // idle, searching, routing, booking, completed
  const [selectedSmartSalon, setSelectedSmartSalon] = useState(null);

  const profile = getProfile();

  const presetLocations = {
    "Bangalore Center": { lat: 12.9716, lng: 77.5946 },
    "Koramangala": { lat: 12.9352, lng: 77.6244 },
    "Indiranagar": { lat: 12.9719, lng: 77.6412 },
    "HSR Layout": { lat: 12.9141, lng: 77.6411 },
    "MG Road": { lat: 12.9738, lng: 77.6119 },
    "Whitefield": { lat: 12.9698, lng: 77.7499 },
    "Jayanagar": { lat: 12.9250, lng: 77.5938 },
  };

  // Request actual browser geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus("detecting");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setUserLocation("My Geolocation");
          setLocationStatus("success");
        },
        (error) => {
          console.warn("Geolocation permission denied or failed, using Bangalore Center fallback.", error);
          setUserCoords({ lat: 12.9716, lng: 77.5946 });
          setUserLocation("Bangalore Center");
          setLocationStatus("denied");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setLocationStatus("unsupported");
    }
  }, []);

  const [addressInput, setAddressInput] = useState(userLocation);
  const [geocoding, setGeocoding] = useState(false);

  // Sync addressInput if userLocation is updated by geolocator automatically
  useEffect(() => {
    setAddressInput(userLocation);
  }, [userLocation]);

  const handleSearchAddress = async (e) => {
    e.preventDefault();
    if (!addressInput || addressInput.trim() === "") return;
    
    setGeocoding(true);
    setActiveRoute(null);
    try {
      const coords = await geocodeAddress(addressInput);
      setUserCoords(coords);
      setUserLocation(addressInput);
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setGeocoding(false);
    }
  };

  // Bounding box mapping for SVG map projection
  const getMapCoords = (lat, lng) => {
    const minLat = 12.90;
    const maxLat = 12.99;
    const minLng = 77.58;
    const maxLng = 77.76;
    
    const pctX = (lng - minLng) / (maxLng - minLng);
    const pctY = 1 - (lat - minLat) / (maxLat - minLat);
    
    const x = Math.max(30, Math.min(350, 30 + pctX * 300));
    const y = Math.max(30, Math.min(190, 30 + pctY * 140));
    return { x, y };
  };

  const userCoord = getMapCoords(userCoords.lat, userCoords.lng);

  // Haversine distance formula
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  // Calculate dynamic distances from the user's selected address
  const salonsWithDistances = useMemo(() => {
    return salons.map((salon) => {
      const distance = haversineDistance(userCoords.lat, userCoords.lng, salon.lat, salon.lng);
      return {
        ...salon,
        distanceKm: distance
      };
    });
  }, [userCoords]);

  // Filter and sort salons
  const filteredSalons = useMemo(() => {
    let list = [...salonsWithDistances];
    
    if (styleQuery) {
      list = filterSalonsByStyle(styleQuery).map(s => {
        const matching = salonsWithDistances.find(swd => swd.id === s.id);
        return matching || s;
      });
    }

    if (activeChip !== "all") {
      list = list.filter((salon) => {
        const specialtiesLower = salon.specialties.map((s) => s.toLowerCase());
        
        switch (activeChip) {
          case "hair":
            return specialtiesLower.some(s => 
              ["hair", "wolf cut", "fade", "textured crop", "buzz cut", "curtain bangs", "butterfly cut", "long layers", "bob cut"].includes(s)
            );
          case "skin":
            return specialtiesLower.includes("skin");
          case "beard":
            return specialtiesLower.includes("beard");
          case "bridal":
            return specialtiesLower.includes("bridal");
          case "korean":
            return specialtiesLower.includes("korean");
          case "budget":
            return salon.priceLevel === 1;
          case "premium":
            return salon.priceLevel === 3;
          case "men":
            return specialtiesLower.includes("men");
          default:
            return true;
        }
      });
    }

    // Sort by selected criteria
    if (sortBy === "nearest") {
      return list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      return list.sort((a, b) => b.rating - a.rating);
    }
  }, [styleQuery, activeChip, salonsWithDistances, sortBy]);

  const handleBook = (salonName) => {
    setBookingMessage(`Booking request submitted to ${salonName}! This is a mock system for the live demo.`);
    setTimeout(() => setBookingMessage(""), 4000);
  };

  const triggerSmartBooking = () => {
    // Find the highest rated salon from the filtered list (ratings first, then distance)
    const sorted = [...filteredSalons].sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm);
    const bestSalon = sorted[0];
    if (!bestSalon) return;
    
    setSelectedSmartSalon(bestSalon);
    setBookingState("searching");
    
    const salonCoord = getMapCoords(bestSalon.lat, bestSalon.lng);
    setActiveRoute({
      salonId: bestSalon.id,
      start: userCoord,
      end: salonCoord
    });
    
    setTimeout(() => {
      setBookingState("routing");
      setTimeout(() => {
        setBookingState("booking");
        setTimeout(() => {
          setBookingState("completed");
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const userHairType = (profile.hairType || "Wavy").toLowerCase();
  const userHairTextureDNA = (profile.styleMatch?.hairTexture || "").toLowerCase();

  return (
    <div className="flex-grow flex flex-col bg-transparent animate-fade-rise h-[calc(100vh-190px)] overflow-hidden">
      <TopBar 
        title="Style Execution" 
        subtitle={styleQuery ? `Matching discovered style: "${styleQuery}"` : "Discover styling hubs near Bangalore to execute your Style DNA"} 
      />

      {/* Horizontal Filter Chip Row - Full Width desktop styled */}
      <div className="w-full bg-surface border-y border-hairline py-4 select-none flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-none flex space-x-3">
          {CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveChip(chip.id)}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider transition-all duration-150 flex-shrink-0 rounded-lg cursor-pointer
                ${activeChip === chip.id
                  ? "bg-violet text-white hover:shadow-glow-violet"
                  : "bg-surface border border-hairline text-graymuted hover:border-graymuted hover:text-ink"
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Status Banner */}
      {bookingMessage && (
        <div className="bg-green-50 border-y border-green-200 text-green-700 py-3.5 px-5 text-center text-xs font-body animate-fade-rise z-10 flex-shrink-0">
          ✓ {bookingMessage}
        </div>
      )}

      {/* Main Grid Split Layout for Desktop with isolated scrolling */}
      <div className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden flex-1 min-h-0">
        
        {/* Left Panel: Hero image & Interactive Map (Col 5) - Sticky */}
        <div className="lg:col-span-5 h-full flex flex-col space-y-6 overflow-y-auto scrollbar-none pb-24">
          
          {/* Editorial Salon Hero Banner */}
          <div className="relative h-44 rounded-lg overflow-hidden border border-hairline shadow-sm select-none flex-shrink-0">
            <img 
              src="/images/salon_hero.png" 
              alt="Editorial Salon Space" 
              className="w-full h-full object-cover filter saturate-[0.95]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-5 text-white">
              <span className="text-[8px] font-display font-bold uppercase tracking-widest text-[#00F0D8] block">Campaign Space</span>
              <h4 className="font-display font-bold text-base leading-tight mt-0.5">Minimalist Aesthetic Hubs</h4>
            </div>
          </div>

          <div className="w-full min-h-[220px] bg-surface border border-hairline rounded-lg relative overflow-hidden flex flex-col justify-between p-5 select-none shadow-sm flex-shrink-0">
            {/* Map grid lines */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#6d5ef5_1px,transparent_1px),linear-gradient(to_bottom,#6d5ef5_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* Radial background glow */}
            <div className="absolute top-[20%] left-[30%] w-72 h-72 bg-violet/5 rounded-full blur-2xl pointer-events-none" />

            <div className="z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-display font-bold tracking-widest text-violet uppercase">
                  Bangalore Grid
                </span>
                <div className="space-y-1.5 mt-0.5 w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-[10px] text-ink uppercase tracking-wider">
                      My Location:
                    </h4>
                    <div className="flex items-center space-x-2">
                      {locationStatus === "success" && (
                        <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-display font-bold uppercase tracking-wider">
                          GPS Active
                        </span>
                      )}
                      {locationStatus === "detecting" && (
                        <span className="text-[8px] bg-violet/10 text-violet border border-violet/20 px-1.5 py-0.5 rounded font-display font-bold uppercase tracking-wider animate-pulse">
                          Detecting GPS...
                        </span>
                      )}
                      {locationStatus !== "success" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              setLocationStatus("detecting");
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                                  setUserLocation("My Geolocation");
                                  setLocationStatus("success");
                                },
                                (err) => {
                                  setLocationStatus("denied");
                                }
                              );
                            }
                          }}
                          className="text-[8px] text-violet hover:text-neon underline font-display font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Use GPS
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <form onSubmit={handleSearchAddress} className="flex items-center space-x-1.5 relative w-full">
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="Type custom Bangalore address..."
                      className="bg-base border border-hairline px-2.5 py-1 text-[10px] text-ink rounded-lg focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet font-body w-full pr-8"
                      disabled={geocoding}
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-graymuted hover:text-ink text-[10px] p-1 font-bold cursor-pointer"
                      disabled={geocoding}
                      title="Geocode address string"
                    >
                      {geocoding ? (
                        <span className="w-3.5 h-3.5 border-2 border-violet border-t-transparent rounded-full animate-spin block" />
                      ) : (
                        "🔍"
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              <button 
                onClick={triggerSmartBooking}
                className="text-[9px] bg-violet text-white hover:bg-neon hover:text-ink px-2.5 py-1.5 font-display font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer hover:shadow-glow-neon"
              >
                AI Smart Book
              </button>
            </div>

            <div className="z-10 flex justify-between items-end border-t border-hairline pt-3 bg-surface/90 backdrop-blur-sm -mx-5 -mb-5 p-5">
              <span className="text-[11px] text-graymuted font-body">
                Displaying {filteredSalons.length} specialist locations
              </span>
              <span className="text-[10px] text-neon font-display font-bold uppercase tracking-wider">
                {filteredSalons[0] ? `${filteredSalons[0].distanceKm}km nearest` : "N/A"}
              </span>
            </div>
            
            {/* Dynamic Map Pins & SVG Route */}
            {activeRoute && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                <line 
                  x1={activeRoute.start.x} 
                  y1={activeRoute.start.y} 
                  x2={activeRoute.end.x} 
                  y2={activeRoute.end.y} 
                  stroke="#7c3aed" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 4" 
                  className="animate-[dash_2s_linear_infinite]"
                  style={{
                    strokeDasharray: "6, 4",
                    animation: "dash 1.5s linear infinite"
                  }}
                />
              </svg>
            )}

            {/* User Pin */}
            <div 
              className="absolute text-2xl transition-all duration-500 z-20"
              style={{ left: `${userCoord.x}px`, top: `${userCoord.y}px`, transform: "translate(-50%, -50%)" }}
            >
              👤
              <span className="absolute left-6 -top-1 bg-violet text-white text-[7px] font-display font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                YOU ({userLocation})
              </span>
            </div>

            {/* Salon Pins */}
            {filteredSalons.map((salon) => {
              const coord = getMapCoords(salon.lat, salon.lng);
              const isSelected = activeRoute?.salonId === salon.id;
              return (
                <div
                  key={salon.id}
                  className={`absolute text-xl transition-all duration-300 ${isSelected ? "animate-bounce z-30" : "opacity-80 z-10"}`}
                  style={{ left: `${coord.x}px`, top: `${coord.y}px`, transform: "translate(-50%, -50%)" }}
                >
                  📍
                  <span className={`absolute left-5 -top-1 px-1.5 py-0.5 rounded shadow-sm text-[7px] font-display uppercase tracking-wider whitespace-nowrap ${
                    isSelected 
                      ? "bg-neon text-ink font-extrabold border border-violet/30" 
                      : "bg-surface text-ink border border-hairline"
                  }`}>
                    {salon.name.split(" ")[0]} ({salon.rating}★)
                  </span>
                </div>
              );
            })}
          </div>

          {/* Style DNA Widget under the map panel */}
          <StyleDNACard layout="sidebar" className="flex-shrink-0" />
        </div>

        {/* Right Panel: Salon Cards Grid (Col 7) - Scrollable */}
        <div className="lg:col-span-7 h-full overflow-y-auto pr-2 scrollbar-none pb-24 space-y-6">
          {/* Sorting Toggle Bar */}
          <div className="flex justify-between items-center bg-surface border border-hairline p-3 rounded-lg select-none mb-4">
            <div>
              <span className="text-[10px] font-display font-bold text-graymuted uppercase tracking-wider block">Sort Order</span>
              <span className="text-xs font-display font-bold text-ink">
                {sortBy === "nearest" ? "Nearest Salon First" : "Top Rated Salon First"}
              </span>
            </div>
            <div className="flex space-x-1 bg-base border border-hairline p-0.5 rounded-lg">
              <button
                onClick={() => setSortBy("nearest")}
                className={`px-3 py-1 text-[9px] font-display font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  sortBy === "nearest"
                    ? "bg-violet text-white shadow-glow-violet"
                    : "text-graymuted hover:text-ink"
                }`}
              >
                Nearest
              </button>
              <button
                onClick={() => setSortBy("rating")}
                className={`px-3 py-1 text-[9px] font-display font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  sortBy === "rating"
                    ? "bg-violet text-white shadow-glow-violet"
                    : "text-graymuted hover:text-ink"
                }`}
              >
                Top Rated
              </button>
            </div>
          </div>

          {filteredSalons.length === 0 ? (
            <div className="text-center py-20 space-y-3 bg-surface border border-hairline rounded-lg p-6">
              <p className="text-sm text-graymuted">No hubs found matching your specifications.</p>
              <button 
                onClick={() => { setActiveChip("all"); }} 
                className="text-xs text-violet font-display font-bold uppercase tracking-wider underline hover:text-neon cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 items-stretch"
            >
              {filteredSalons.map((salon) => {
                const isRecommended = salon.specialties.some((spec) => {
                  const s = spec.toLowerCase();
                  return s.includes(userHairType) || 
                         (userHairTextureDNA && s.includes(userHairTextureDNA)) ||
                         (styleQuery && s.includes(styleQuery.toLowerCase()));
                });

                return (
                  <motion.div key={salon.id} variants={itemVariants} className="flex">
                    <Card className="p-0 overflow-hidden shadow-sm hover:shadow-md border-violet/10 hover:border-violet flex flex-col md:flex-row flex-1">
                      
                      {/* Card Thumbnail */}
                      <div className="md:w-1/3 h-40 md:h-auto relative overflow-hidden bg-base select-none">
                        <img 
                          src={salon.imageUrl || getSalonThumbnail(salon)} 
                          alt={salon.name} 
                          className="w-full h-full object-cover filter saturate-[0.95]"
                        />
                      </div>

                      {/* Details */}
                      <div className="md:w-2/3 p-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex justify-between items-start border-b border-hairline pb-2 mb-2">
                            <div>
                              <h3 className="font-display font-black text-sm text-ink tracking-wide">
                                {salon.name}
                              </h3>
                              <p className="text-[10px] text-graymuted font-body mt-0.5">
                                {salon.area} • {salon.distanceKm} km away
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center justify-end space-x-0.5">
                                <span className="text-violet text-xs">★</span>
                                <span className="text-xs font-display font-bold text-ink">{salon.rating}</span>
                              </div>
                              <p className="text-[10px] text-neon font-display mt-0.5 font-black uppercase">
                                {"₹".repeat(salon.priceLevel)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2.5 mb-2">
                            {isRecommended && (
                              <div className="inline-flex items-center space-x-1.5 bg-violet/10 border border-violet/20 px-2 py-0.5 rounded text-[8px] font-display font-bold uppercase tracking-wider text-violet select-none">
                                <span>★ Fits Your Style DNA</span>
                              </div>
                            )}

                            {salon.bestFor && (
                              <div className="inline-flex items-center bg-neon/10 border border-neon/20 px-2 py-0.5 rounded text-[8px] font-display font-bold uppercase tracking-wider text-neon select-none">
                                <span>✦ Best For: {salon.bestFor}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-graymuted leading-relaxed font-body italic mb-2">
                            "{salon.tagline}"
                          </p>

                          {salon.reviews && salon.reviews.length > 0 && (
                            <div className="border-t border-hairline/40 pt-2.5 mt-2 space-y-1 bg-base/30 p-2.5 rounded-lg border border-hairline/30">
                              <span className="text-[8px] font-display font-extrabold uppercase tracking-widest text-violet block">Latest Review Digest</span>
                              <div className="text-[10px] text-graymuted font-body leading-normal">
                                <span className="text-ink font-bold font-display text-[9px] mr-1">{salon.reviews[0].author}:</span> 
                                "{salon.reviews[0].text}"
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1 select-none">
                          {salon.specialties.map((spec) => (
                            <span
                              key={spec}
                              className="border border-hairline bg-base px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-wider text-ink rounded"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-2.5 select-none">
                          <button
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(salon.name + " " + salon.area + " Bangalore")}`, "_blank")}
                            className="flex-1 py-2 bg-white border border-hairline hover:border-violet hover:text-violet text-[9.5px] font-display font-bold uppercase tracking-wider text-ink transition-colors rounded-lg cursor-pointer"
                          >
                            Visit Website
                          </button>
                          <button
                            onClick={() => handleBook(salon.name)}
                            className="flex-1 py-2 bg-violet hover:bg-[#6b2fd4] hover:shadow-glow-violet text-[9.5px] font-display font-bold uppercase tracking-wider text-white transition-colors rounded-lg cursor-pointer"
                          >
                            Book appointment
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

      </div>

      {/* AI Smart Booking Modal */}
      {bookingState !== "idle" && selectedSmartSalon && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
          <div className="bg-surface rounded-lg border border-hairline shadow-2xl p-6 w-full max-w-md animate-fade-rise flex flex-col space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-hairline pb-3">
               <h3 className="font-display font-black text-xs text-ink tracking-wider uppercase flex items-center space-x-1.5">
                <span className="animate-pulse text-violet">✦</span>
                <span>AI Smart Booking Agent</span>
              </h3>
              {bookingState === "completed" && (
                <button 
                  onClick={() => setBookingState("idle")}
                  className="text-graymuted hover:text-ink font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stages */}
            {bookingState === "searching" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-10 h-10 border-4 border-violet border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-display font-bold uppercase tracking-wider text-ink">Analyzing Bangalore Grid...</p>
                  <p className="text-[10px] text-graymuted font-body">Comparing ratings and mapping proximity coordinates from {userLocation}...</p>
                </div>
              </div>
            )}

            {bookingState === "routing" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-10 h-10 border-4 border-neon border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-display font-bold uppercase tracking-wider text-ink">Calculating Proximity Routes...</p>
                  <p className="text-[10px] text-graymuted font-body">Generating optimal street directions to {selectedSmartSalon.name}...</p>
                </div>
              </div>
            )}

            {bookingState === "booking" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-10 h-10 border-4 border-cyan border-t-transparent rounded-full animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-display font-bold uppercase tracking-wider text-ink">Submitting Reservation...</p>
                  <p className="text-[10px] text-graymuted font-body">Securing priority consultation slot via digital API bridge...</p>
                </div>
              </div>
            )}

            {bookingState === "completed" && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-start space-x-3 select-text">
                  <span className="text-lg font-bold">✓</span>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase tracking-wide">Consultation Scheduled!</h4>
                    <p className="text-[10px] text-emerald-300/80 font-body">Priority seat locked in automatically based on ratings & distance.</p>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="bg-base border border-hairline p-4 rounded-lg space-y-3 font-body select-text">
                  <div className="flex justify-between items-center border-b border-hairline/60 pb-2">
                    <span className="text-[9px] font-display font-bold uppercase tracking-wider text-graymuted">Reservation ticket</span>
                    <span className="text-[9px] font-display font-bold text-violet bg-violet/10 px-2 py-0.5 rounded-full">MAGMA-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-graymuted">Salon Partner:</span>
                      <span className="font-display font-bold text-ink">{selectedSmartSalon.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graymuted">Location:</span>
                      <span className="font-display font-bold text-ink">{selectedSmartSalon.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graymuted">Ratings Verified:</span>
                      <span className="font-display font-bold text-ink flex items-center space-x-0.5">
                        <span className="text-violet">★</span>
                        <span>{selectedSmartSalon.rating} / 5.0</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graymuted">Dynamic Distance:</span>
                      <span className="font-display font-bold text-ink">{selectedSmartSalon.distanceKm} km away</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graymuted">ETA via Cab:</span>
                      <span className="font-display font-bold text-neon">{Math.round(selectedSmartSalon.distanceKm * 3.5)} Mins</span>
                    </div>
                    <div className="flex justify-between border-t border-hairline/60 pt-2 text-[10px] flex-col md:flex-row md:justify-between">
                      <span className="text-graymuted">Suggested Route:</span>
                      <span className="font-display font-bold text-ink text-right max-w-[200px] truncate">{userLocation} Main Rd &rarr; {selectedSmartSalon.area} Ring Rd</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedSmartSalon.name + " " + selectedSmartSalon.area + " Bangalore")}`, "_blank");
                    }}
                    className="flex-1 py-2 bg-surface border border-hairline hover:border-violet text-ink hover:text-violet text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Open Website
                  </button>
                  <button
                    onClick={() => setBookingState("idle")}
                    className="flex-1 py-2 bg-violet hover:bg-[#6b2fd4] hover:shadow-glow-violet text-white text-[10px] font-display font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Great, Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
export default SalonFinder;
