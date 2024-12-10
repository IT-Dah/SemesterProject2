const API_BASE_URL = "https://v2.api.noroff.dev/";

export async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API error:", error.message);
    return null;
  }
}

export async function fetchListings(
  limit = 10,
  page = 1,
  sort = "endsAt",
  sortOrder = "asc"
) {
  const endpoint = `auction/listings?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;
  return await fetchFromApi(endpoint);
}
