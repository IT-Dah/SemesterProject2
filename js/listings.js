// js/listings.js
import { fetchListings } from "./api.js";

/**
 * Populate listings as cards in the UI.
 * @param {Array} listings - Array of listings to display.
 */
export function populateListings(listings) {
  console.log("Populating Listings:", listings); // Log the listings array
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear existing content

  if (!listings || listings.length === 0) {
    cardContainer.innerHTML =
      "<p>No listings found. Please check back later.</p>";
    return;
  }

  listings.forEach((listing) => {
    const { title, description, media, bids, endsAt } = listing;

    // Fallbacks for missing data
    const imageUrl =
      media && media.length > 0 ? media[0].url : "assets/images/default.svg";
    const highestBid =
      bids && bids.length > 0
        ? Math.max(...bids.map((bid) => bid.amount))
        : "No bids yet";
    const endTime = new Date(endsAt).toLocaleString();

    // Card HTML
    const cardHTML = `
      <div class="col-md-4">
        <div class="card">
          <img src="${imageUrl}" class="card-img-top" alt="${title}" onerror="this.src='assets/images/default.svg';">
          <div class="card-body text-center">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${
              description || "No description available"
            }</p>
            <p class="card-text"><strong>Highest Bid:</strong> ${highestBid}</p>
            <p class="card-text"><strong>Ends At:</strong> ${endTime}</p>
            <button class="btn btn-primary">Bid Now</button>
          </div>
        </div>
      </div>
    `;

    cardContainer.innerHTML += cardHTML;
  });
}

/**
 * Load and display the last 12 auction listings.
 */
export async function loadListings() {
  const response = await fetchListings(); // Fetch the last 12 listings
  if (response && response.data) {
    populateListings(response.data); // Pass the data array to populateListings
  } else {
    console.error("Failed to load listings.");
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML =
      "<p>Failed to load listings. Please try again later.</p>";
  }
}
