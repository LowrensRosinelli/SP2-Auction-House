import { getToken } from "./storage.js";

export function requireAuth(redirectTo = "/SP2-Auction-House/index.html") {
  const token = getToken();
  if (!token) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

export function requireGuest(redirectTo = "/SP2-Auction-House/listings/") {
  const token = getToken();
  if (token) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
