export const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY_PLACEHOLDER = "PASTE_NOROFF_API_KEY_HERE";

function readRuntimeApiKey() {
  if (typeof window === "undefined") return "";

  const fromWindow = String(window.__NOROFF_API_KEY__ || "").trim();
  if (fromWindow && fromWindow !== API_KEY_PLACEHOLDER) return fromWindow;

  const fromStorage = String(localStorage.getItem("noroff_api_key") || "").trim();
  if (fromStorage && fromStorage !== API_KEY_PLACEHOLDER) return fromStorage;

  const fromMeta = String(
    document
      .querySelector('meta[name="noroff-api-key"]')
      ?.getAttribute("content") || ""
  ).trim();

  if (fromMeta && fromMeta !== API_KEY_PLACEHOLDER) return fromMeta;
  return "";
}

const runtimeApiKey = readRuntimeApiKey();
export const API_KEY = runtimeApiKey || API_KEY_PLACEHOLDER;
export const HAS_REAL_API_KEY = API_KEY !== API_KEY_PLACEHOLDER;
export const APP_NAME = "SP2 Auction House";
export const APP_VERSION = "1.0.0";

export const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  listings: "/auction/listings",
  profiles: "/auction/profiles"
};
