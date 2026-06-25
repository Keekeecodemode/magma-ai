const PROFILE_KEY = "magma_profile_v1";

const DEFAULT_PROFILE = {
  name: "",
  age: 22,
  gender: "Prefer not to say",
  hairType: "Straight",
  skinType: "Normal",
  onboarded: false,
  streak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  lastActiveDate: null,
  completedToday: [],
  totalRitualsCompleted: 0,
  badges: [],
  styleMatch: null,
};

export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getProfile() {
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) {
    return DEFAULT_PROFILE;
  }
  
  try {
    let profile = JSON.parse(data);
    const todayStr = getTodayString();
    
    // Check day rollover for active date
    if (profile.lastActiveDate !== todayStr) {
      // It is a new day! Reset completedToday array
      profile.completedToday = [];
      profile.lastActiveDate = todayStr;
      
      // Check if they skipped a day for their streak
      if (profile.lastCompletedDate) {
        const parseDate = (str) => {
          const [y, m, d] = str.split('-').map(Number);
          return new Date(y, m - 1, d);
        };
        const lastCompleted = parseDate(profile.lastCompletedDate);
        const today = parseDate(todayStr);
        const diffTime = today - lastCompleted;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          profile.streak = 0;
        }
      }
      
      // Save the day-rollover changes
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    
    return profile;
  } catch (e) {
    console.error("Error parsing profile from local storage, resetting", e);
    return DEFAULT_PROFILE;
  }
}

export function updateProfile(partial) {
  const current = getProfile();
  const updated = { ...current, ...partial };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

function checkAndAwardBadges(profile) {
  const badges = new Set(profile.badges || []);
  
  if (profile.streak >= 7) badges.add("consistent");
  if (profile.streak >= 14) badges.add("glowing");
  if (profile.streak >= 30) badges.add("magnetic_af");
  if (profile.totalRitualsCompleted >= 10) badges.add("self_care");
  
  profile.badges = Array.from(badges);
}

export function registerStreakProgress() {
  const profile = getProfile();
  const todayStr = getTodayString();
  
  if (profile.lastCompletedDate === todayStr) {
    // Already counted completion today
    return profile;
  }

  const oldLastCompleted = profile.lastCompletedDate;
  profile.lastCompletedDate = todayStr;
  
  if (!oldLastCompleted) {
    profile.streak = 1;
  } else {
    const parseDate = (str) => {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    };
    const lastCompleted = parseDate(oldLastCompleted);
    const today = parseDate(todayStr);
    const diffTime = today - lastCompleted;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      profile.streak += 1;
    } else {
      profile.streak = 1; // Skipped a day, reset streak to 1
    }
  }

  if (profile.streak > profile.longestStreak) {
    profile.longestStreak = profile.streak;
  }

  checkAndAwardBadges(profile);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function toggleRitualItem(itemId) {
  const profile = getProfile();
  const completedToday = profile.completedToday || [];
  const idx = completedToday.indexOf(itemId);
  
  let isChecking = false;
  if (idx > -1) {
    completedToday.splice(idx, 1);
  } else {
    completedToday.push(itemId);
    profile.totalRitualsCompleted += 1;
    isChecking = true;
  }
  
  profile.completedToday = completedToday;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

  if (isChecking) {
    // Register streak increment if checking an item
    return registerStreakProgress();
  } else {
    // If they unchecked an item, we still check badges in case total was updated,
    // but we don't rollback streak (standard habit tracker behavior).
    checkAndAwardBadges(profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }
}

export function resetProfile() {
  localStorage.removeItem(PROFILE_KEY);
  return DEFAULT_PROFILE;
}
