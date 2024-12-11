import { fetchFromApi } from "./utils/api.js";

/**
 * Fetch and display listing details.
 */
async function loadListingDetails() {
  const listingContainer = document.getElementById("listing-container");
  const listingId = new URLSearchParams(window.location.search).get("id"); // Get `id` from URL

  if (!listingId) {
    listingContainer.innerHTML = "<p>Invalid listing. No ID provided.</p>";
    return;
  }

  try {
    const listing = await fetchFromApi(
      `auction/listings/${listingId}?_bids=true`
    );
    console.log("Listing details:", listing);

    // Build the HTML for the listing
    const { title, description, media, endsAt, bids } = listing;
    const imageUrl = media?.[0]?.url || "assets/images/default.svg";

    let bidsHtml = "";
    if (bids?.length > 0) {
      bidsHtml = bids
        .map((bid) => `<li>${bid.bidder.name} bid ${bid.amount} NOK</li>`)
        .join("");
    } else {
      bidsHtml = "<li>No bids yet.</li>";
    }

    listingContainer.innerHTML = `
      <div class="card">
        <img src="${imageUrl}" alt="${title}" class="card-img-top">
        <div class="card-body">
          <h2>${title}</h2>
          <p>${description || "No description available."}</p>
          <p><strong>Ends At:</strong> ${new Date(endsAt).toLocaleString()}</p>
        </div>
      </div>
      <section>
        <h3>Recent Bids:</h3>
        <ul>${bidsHtml}</ul>
      </section>
    `;
  } catch (error) {
    console.error("Error loading listing details:", error);
    listingContainer.innerHTML =
      "<p>Failed to load listing. Please try again later.</p>";
  }
}

/**
 * Handle bid submission.
 */
async function handleBid(event) {
  event.preventDefault();
  const bidAmount = document.getElementById("bid-amount").value;
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (!bidAmount || !listingId) {
    alert("Invalid bid or listing ID.");
    return;
  }

  try {
    const response = await fetchFromApi(`auction/listings/${listingId}/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(bidAmount, 10) }),
    });

    if (response) {
      alert("Bid placed successfully!");
      loadListingDetails(); // Reload listing details to update bids
    } else {
      alert("Failed to place bid. Please try again.");
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("An error occurred. Please try again.");
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadListingDetails();

  const bidForm = document.getElementById("bid-form");
  bidForm.addEventListener("submit", handleBid);
});
