const STORAGE_KEYS = {
  token: "sp2_token",
  profile: "sp2_profile"
};

export function setToken(token) {
  localStorage.setItem(STORAGE_KEYS.token, token);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function setProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export function getProfile() {
  const raw = localStorage.getItem(STORAGE_KEYS.profile);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth({ token, profile }) {
  setToken(token);
  setProfile(profile);
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.profile);
}

export function isLoggedIn() {
  return Boolean(getToken());
}
