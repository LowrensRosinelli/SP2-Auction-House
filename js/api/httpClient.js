import { API_BASE_URL, API_KEY, HAS_REAL_API_KEY } from "../config.js";
import { getToken } from "../utils/storage.js";

function buildHeaders(customHeaders = {}, options = {}) {
  const { useAuth = false, includeApiKey = false } = options;
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders
  };

  if (includeApiKey && API_KEY && HAS_REAL_API_KEY) {
    headers["X-Noroff-API-Key"] = API_KEY;
  }

  if (useAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

function safeRequestBody(body) {
  if (!body || typeof body !== "object") return body;

  const clone = { ...body };
  if ("password" in clone) {
    clone.password = "***redacted***";
  }
  return clone;
}

function extractErrorMessage(payload) {
  const firstError = payload?.errors?.[0];
  if (typeof firstError === "string") return firstError;
  if (firstError?.message) return firstError.message;
  if (payload?.message) return payload.message;
  if (payload?.status && payload?.statusCode) return `${payload.status} (${payload.statusCode})`;
  return "Request failed";
}

function buildUrl(path, query) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function httpClient(path, options = {}) {
  const {
    method = "GET",
    body,
    query,
    headers,
    auth = false,
    includeApiKey = auth
  } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: buildHeaders(headers, { useAuth: auth, includeApiKey }),
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text || null;
  }

  if (!response.ok) {
    console.error("HTTP request failed", {
      status: response.status,
      url: buildUrl(path, query),
      payload,
      requestBody: safeRequestBody(body)
    });

    const error = new Error(extractErrorMessage(payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload?.data ?? payload;
}
