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
  } catch {
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
  card.className = "col-lg-3 col-md-4 col-sm-6 mb-4";

  const title = listing.title || "Untitled";
  const highestBid = listing.bids?.length
    ? `${Math.max(...listing.bids.map((bid) => bid.amount))} NOK`
    : "No bids yet";
  const endsAt = new Date(listing.endsAt).toLocaleString();

  const defaultImage = "/assets/images/default.svg";
  let imageUrl = defaultImage;
  let imageAlt = "No image available";

  if (
    listing.media &&
    Array.isArray(listing.media) &&
    listing.media.length > 0
  ) {
    const firstMedia = listing.media[0];
    if (
      firstMedia?.url &&
      typeof firstMedia.url === "string" &&
      isValidUrl(firstMedia.url)
    ) {
      imageUrl = firstMedia.url;
      imageAlt = firstMedia.alt || title;
    }
  }

  card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img 
        src="${imageUrl}" 
        class="card-img-top"
        alt="${imageAlt}" 
        style="height: 200px; object-fit: cover;"
        onerror="this.src='${defaultImage}';">
      <div class="card-body text-center">
        <h5 class="card-title">${title}</h5>
        <p class="card-text"><strong>Current Bid:</strong> ${highestBid}</p>
        <p class="card-text"><small><strong>Ends At:</strong> ${endsAt}</small></p>
        <a href="details.html?id=${listing.id}" class="btn btn-primary w-100">View Details</a>
      </div>
    </div>
  `;

  return card;
}

/**
 * Display a loading spinner.
 * @param {HTMLElement} container - The container where the spinner will be added.
 */
function showLoadingSpinner(container) {
  container.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
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
  if (!cardContainer) {
    console.error("Card container not found in the DOM.");
    return;
  }

  showLoadingSpinner(cardContainer);

  try {
    const listings = await fetchListings(
      limit,
      page,
      sort,
      sortOrder,
      "_bids=true&_seller=true"
    );
    console.log("Listings fetched:", listings);

    cardContainer.innerHTML = ""; // Clear the container
    if (!listings.length) {
      cardContainer.innerHTML = "<p>No listings available.</p>";
      return;
    }

    listings.forEach((listing) => {
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
 * Setup pagination for listings.
 */
export function setupPagination() {
  const nextPageBtn = document.getElementById("next-page");
  const prevPageBtn = document.getElementById("prev-page");
  let currentPage = 1;

  if (!nextPageBtn || !prevPageBtn) {
    console.error("Pagination buttons not found in the DOM.");
    return;
  }

  // Initial button state
  prevPageBtn.disabled = currentPage === 1;

  nextPageBtn.addEventListener("click", async () => {
    currentPage++;
    await loadListings(12, currentPage);
    prevPageBtn.disabled = false;
  });

  prevPageBtn.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await loadListings(12, currentPage);
    }
    prevPageBtn.disabled = currentPage === 1;
  });
}
