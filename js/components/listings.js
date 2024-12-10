import { fetchListings } from "../utils/api.js";

/**
 * Validates if a given URL is valid.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create a card for a single listing.
 * @param {object} listing - The listing data to display.
 * @returns {HTMLElement} - The HTML card element for the listing.
 */
export function createCard(listing) {
  const card = document.createElement("div");
  card.className = "col-lg-2 col-md-3 col-sm-6 mb-4";

  const title = listing.title || "Untitled";
  const highestBid = listing.bids?.length
    ? `${Math.max(...listing.bids.map((bid) => bid.amount))} NOK`
    : "No bids yet";
  const endsAt = new Date(listing.endsAt).toLocaleString();

  // Media fallback: Check for media URL validity
  const imageUrl =
    listing.media?.length > 0 && isValidUrl(listing.media[0].url)
      ? listing.media[0].url
      : "assets/images/default.svg";

  card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img 
        src="${imageUrl}" 
        class="card-img-top" 
        alt="${listing.media?.[0]?.alt || title}" 
        onerror="this.src='assets/images/default.svg';">
      <div class="card-body text-center">
        <h5 class="card-title">${title}</h5>
        <p class="card-text"><strong>Current Bid:</strong> ${highestBid}</p>
        <p class="card-text"><small>${endsAt}</small></p>
        <button class="btn btn-primary w-100">Bid</button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Load and display listings on the page.
 * @param {number} limit - The number of listings to fetch.
 * @param {number} page - The current page number to fetch.
 * @param {string} sort - The field to sort by (e.g., "endsAt").
 * @param {string} sortOrder - The order to sort in ("asc" or "desc").
 */
export async function loadListings(
  limit = 12,
  page = 1,
  sort = "endsAt",
  sortOrder = "asc"
) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "<p>Loading listings...</p>";

  try {
    // Fetch listings with enriched data (_bids and _seller included)
    const listings = await fetchListings(
      limit,
      page,
      sort,
      sortOrder,
      "_bids=true&_seller=true"
    );
    console.log("Listings fetched:", listings);

    cardContainer.innerHTML = ""; // Clear placeholder

    if (!Array.isArray(listings)) {
      console.error("API response is not an array:", listings);
      cardContainer.innerHTML =
        "<p>Failed to load listings. Invalid data format.</p>";
      return;
    }

    listings.forEach((listing) => {
      console.log("Media for listing:", listing.media); // Debug log for media
      const card = createCard(listing);
      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading listings:", error);
    cardContainer.innerHTML =
      "<p>Failed to load listings. Please try again later.</p>";
  }
}

/**
 * Setup pagination functionality for the listings.
 */
export function setupPagination() {
  const nextPageBtn = document.getElementById("next-page");
  const prevPageBtn = document.getElementById("prev-page");
  let currentPage = 1;

  nextPageBtn.addEventListener("click", () => {
    currentPage++;
    loadListings(12, currentPage); // Fetch 12 listings per page
    prevPageBtn.disabled = false;
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadListings(12, currentPage); // Fetch 12 listings per page
    }
    if (currentPage === 1) {
      prevPageBtn.disabled = true;
    }
  });
}
