import axios from "axios";

// EXPO_PUBLIC_-prefixed vars are inlined at build time by Expo from
// .env (see .env.example) — different values per environment via
// eas.json build profiles (development/preview/production).
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  // Fails loudly instead of silently shipping a build that points
  // at a developer's laptop IP. Set EXPO_PUBLIC_API_URL in .env
  // (local dev) or in the eas.json build profile (real builds).
  console.warn(
    "[api/client] EXPO_PUBLIC_API_URL is not set — falling back to " +
      "a local dev IP. This will NOT work outside your dev machine's " +
      "network. Set EXPO_PUBLIC_API_URL in .env — see .env.example."
  );
}

export const api = axios.create({
  baseURL: API_URL ?? "http://192.168.43.99:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log every failed request with full detail so issues are easy
// to spot in the Metro/dev console instead of a vague app alert.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(
        "[API ERROR]",
        error.config?.method?.toUpperCase(),
        error.config?.url,
        "->",
        error.response.status,
        JSON.stringify(error.response.data)
      );
    } else if (error.request) {
      console.log(
        "[API NETWORK ERROR]",
        error.config?.method?.toUpperCase(),
        error.config?.url,
        "->",
        error.message
      );
    } else {
      console.log("[API SETUP ERROR]", error.message);
    }

    return Promise.reject(error);
  }
);
