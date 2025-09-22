// Generic fetch client for all requests
// SETUP------------------------------------------------------------------
import {load} from "../storage/storageService.js";

const BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = '9bfb5ab8-4778-439a-8f04-c9d2efdd075b';


async function apiClient(endpoint, options = {}) {
  const { body, ...customOptions } = options;
  const accessToken = load("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key" : API_KEY,
  };

    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const config = {
    method: body ? "POST" : "GET", // default GET unless body is provided
    ...customOptions, // allow overrides
    headers: {
      ...headers,
      ...customOptions.headers, // allow overrides
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + endpoint, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.message || "An API error occurred");
    }

    if (response.status === 204) {
      return null; // No content
    }

    return await response.json();
  } catch (error) {
    console.error("API Client Error:", error);
    throw error; // Escalate to caller
  }
}

// Export helpers
export const get = (endpoint) => apiClient(endpoint);
export const post = (endpoint, body) => apiClient(endpoint, { body });
export const put = (endpoint, body) => apiClient(endpoint, { method: "PUT", body });
export const del = (endpoint) => apiClient(endpoint, { method: "DELETE" });