import { ENDPOINTS } from "../config.js";
import { httpClient } from "./httpClient.js";

export async function registerUser(payload) {
  return httpClient(ENDPOINTS.register, {
    method: "POST",
    includeApiKey: true,
    body: {
      ...payload,
      venueManager: false
    }
  });
}

export async function loginUser(payload) {
  return httpClient(ENDPOINTS.login, {
    method: "POST",
    includeApiKey: true,
    body: {
      ...payload
    }
  });
}
