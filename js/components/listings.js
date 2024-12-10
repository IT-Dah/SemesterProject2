import { fetchListings } from "../utils/api.js";

/**
 * Create a card for a single listing.
 */
export function createCard(listing) {
  const card = document.createElement("div");
  card.className = "col-lg-2 col-md-3 col-sm-6 mb-4";

  const title = listing.title || "Untitled";
  const highestBid = listing.bids?.length
    ? `${Math.max(...listing.bids.map((bid) => bid.amount))} NOK`
    : "No bids yet";
  const endsAt = new Date(listing.endsAt).toLocaleString();
  const imageUrl = listing.media?.[0] || "assets/images/default.svg";

  card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${imageUrl}" class="card-img-top" alt="${title}" onerror="this.src='assets/images/default.svg';">
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
 * Load and display listings.
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
    const listings = await fetchListings(limit, page, sort, sortOrder);
    console.log("Listings fetched:", listings); // Log to confirm the array of listings

    cardContainer.innerHTML = ""; // Clear placeholder

    if (!Array.isArray(listings)) {
      console.error("API response is not an array:", listings);
      cardContainer.innerHTML =
        "<p>Failed to load listings. Invalid data format.</p>";
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
 * Setup pagination functionality.
 */
export function setupPagination() {
  const nextPageBtn = document.getElementById("next-page");
  const prevPageBtn = document.getElementById("prev-page");
  let currentPage = 1;

  nextPageBtn.addEventListener("click", () => {
    currentPage++;
    loadListings(12, currentPage);
    prevPageBtn.disabled = false;
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadListings(12, currentPage);
    }
    if (currentPage === 1) {
      prevPageBtn.disabled = true;
    }
  });
}
