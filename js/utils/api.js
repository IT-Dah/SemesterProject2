export const API_BASE_URL = "https://v2.api.noroff.dev/";

/**
 * Fetch data from the API.
 */
export async function fetchListings(
  limit = 10,
  page = 1,
  sort = "endsAt",
  sortOrder = "asc"
) {
  const endpoint = `auction/listings?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    console.log("Fetching from API:", `${API_BASE_URL}${endpoint}`); // Debug log
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    console.log("API Response:", data); // Log the raw API response
    return data.data || []; // Extract only the `data` property
  } catch (error) {
    console.error("Error fetching from API:", error);
    return [];
  }
}
