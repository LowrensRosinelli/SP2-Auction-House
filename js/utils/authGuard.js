import { getToken } from "./storage.js";

export function requireAuth(redirectTo = "/index.html") {
  const token = getToken();
  if (!token) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requireGuest(redirectTo = "/listings") {
  const token = getToken();
  if (token) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
