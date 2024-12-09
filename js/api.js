// js/api.js
import { API_BASE_URL } from "./config.js";

/**
 * Fetch data from the API.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} options - Options for the fetch request.
 * @returns {Promise<object>} - The JSON response from the API.
 */
export async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching from API:", url); // Debug log

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("API Data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching from API:", error.message);
    return null;
  }
}

/**
 * Fetch auction listings with optional pagination and additional data.
 * @param {number} limit - Number of results to fetch.
 * @param {number} page - Page number to fetch.
 * @returns {Promise<Array>} - Array of listings.
 */
export async function fetchListings(limit = 12, page = 1) {
  const endpoint = `auction/listings?limit=${limit}&page=${page}&_seller=true&_bids=true`;
  return await fetchFromApi(endpoint);
}
