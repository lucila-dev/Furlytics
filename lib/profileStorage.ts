const PROFILE_KEY = "furlytics-profile";

export type StoredProfile = {
  name: string;
  photo: string | null; // base64 data URL
  birthday: string | null;
  phone: string | null;
  address: string | null;
};

const defaultProfile: StoredProfile = {
  name: "",
  photo: null,
  birthday: null,
  phone: null,
  address: null,
};

export function getProfile(): StoredProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as StoredProfile;
    return { ...defaultProfile, ...parsed };
  } catch {
    return defaultProfile;
  }
}

export function setProfile(profile: Partial<StoredProfile>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getProfile();
    const next = { ...current, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
