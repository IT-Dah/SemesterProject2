export const API_BASE_URL = "https://v2.api.noroff.dev/";

/**
 * Base function to fetch data from the API.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} options - Optional fetch configurations (e.g., method, headers, body).
 * @returns {Promise<object>} - The parsed JSON response from the API.
 */
export async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching from API:", url); // Debug log

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error (${response.status}): ${
          errorData.message || response.statusText
        }`
      );
    }

    const data = await response.json();
    console.log("API Response:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching from API:", error);
    throw error; // Propagate error to allow handling in calling functions
  }
}

/**
 * Fetch listings from the API.
 * @param {number} limit - Number of listings per page.
 * @param {number} page - Current page number.
 * @param {string} sort - Field to sort listings by.
 * @param {string} sortOrder - Sorting order ("asc" or "desc").
 * @param {string} additionalParams - Additional query parameters (e.g., `_bids=true`).
 * @returns {Promise<object[]>} - An array of listings.
 */
export async function fetchListings(
  limit = 10,
  page = 1,
  sort = "endsAt",
  sortOrder = "asc",
  additionalParams = ""
) {
  const endpoint = `auction/listings?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}&${additionalParams}`;
  try {
    const data = await fetchFromApi(endpoint);
    return data.data || []; // Extract only the `data` property if present
  } catch (error) {
    console.error("Error fetching listings:", error);
    return []; // Return an empty array as a fallback
  }
}
