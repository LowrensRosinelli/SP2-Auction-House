import { ENDPOINTS } from "../config.js";
import { httpClient } from "./httpClient.js";

export async function getProfile(name) {
  return httpClient(`${ENDPOINTS.profiles}/${name}`, {
    auth: true,
    query: {
      _listings: true,
      _wins: true
    }
  });
}

export async function updateProfile(name, payload) {
  return httpClient(`${ENDPOINTS.profiles}/${name}`, {
    method: "PUT",
    auth: true,
    body: payload
  });
}

export async function getProfileListings(name) {
  return httpClient(`${ENDPOINTS.profiles}/${name}/listings`, {
    auth: true,
    query: {
      _bids: true
    }
  });
}

export async function getListingsBidOn(name) {
  return httpClient(`${ENDPOINTS.profiles}/${name}/bids`, {
    auth: true,
    query: {
      _listings: true
    }
  });
}
