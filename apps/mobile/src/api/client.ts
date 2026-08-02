import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.43.99:3001",
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
