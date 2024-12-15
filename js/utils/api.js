export const API_BASE_URL = "https://v2.api.noroff.dev/";

/**
 * Base function to fetch data from the API.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} options - Optional fetch configurations (e.g., method, headers, body).
 * @returns {Promise<object>} - The parsed JSON response from the API.
 */
export async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Fetching from API:", url, "with options:", options);

  try {
    const response = await fetch(url, options);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `API Error (${response.status}): ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage; // Prefer API-provided message
      } catch (jsonError) {
        console.warn("Error parsing API error response:", jsonError);
      }
      throw new Error(errorMessage);
    }

    // Parse and validate the response
    const data = await response.json();
    console.log("API Response:", data);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid API response: Response is not an object.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching from API:", error.message || error);
    throw error; // Rethrow to let calling functions handle it
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
    const response = await fetchFromApi(endpoint);
    console.log("Full API Response:", response);

    // Validate and extract `data` from the response
    if (response && response.data && Array.isArray(response.data)) {
      console.log("Listings fetched:", response.data);
      return response.data; // Return the listings array
    } else {
      console.warn(
        "Unexpected API response format. Expected an array:",
        response
      );
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error("Error fetching listings:", error.message || error);
    return [];
  }
}
