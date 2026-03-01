import { ENDPOINTS } from "../config.js";
import { httpClient } from "./httpClient.js";

export async function placeBid(listingId, amount) {
  return httpClient(`${ENDPOINTS.listings}/${listingId}/bids`, {
    method: "POST",
    auth: true,
    body: {
      amount: Number(amount)
    }
  });
}
