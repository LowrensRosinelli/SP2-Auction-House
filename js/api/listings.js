import { ENDPOINTS } from "../config.js";
import { httpClient } from "./httpClient.js";

export async function getListings(params = {}) {
  return httpClient(ENDPOINTS.listings, {
    query: {
      _bids: true,
      _seller: true,
      ...params
    }
  });
}

export async function getListingById(id) {
  return httpClient(`${ENDPOINTS.listings}/${id}`, {
    query: {
      _seller: true,
      _bids: true
    }
  });
}

export async function createListing(payload) {
  return httpClient(ENDPOINTS.listings, {
    method: "POST",
    auth: true,
    body: payload
  });
}

export async function updateListing(id, payload) {
  return httpClient(`${ENDPOINTS.listings}/${id}`, {
    method: "PUT",
    auth: true,
    body: payload
  });
}

export async function deleteListing(id) {
  return httpClient(`${ENDPOINTS.listings}/${id}`, {
    method: "DELETE",
    auth: true
  });
}
