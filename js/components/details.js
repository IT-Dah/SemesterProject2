// js/components/details.js
import { fetchFromApi } from "../utils/api.js";

/**
 * Fetch and display listing details.
 */
async function loadListingDetails() {
  const listingContainer = document.getElementById("listing-container");
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (!listingId) {
    listingContainer.innerHTML =
      "<p class='error-message'>Invalid listing. No ID provided.</p>";
    return;
  }

  try {
    // Fetch listing (unwrap { data: ... } if present)
    const res = await fetchFromApi(`auction/listings/${listingId}?_bids=true`);
    const data = res?.data || res;

    // Safe destructuring with fallbacks
    const {
      title = "Untitled",
      description = "",
      media = [],
      endsAt = null,
      bids = [],
    } = data;

    // Media (Noroff shape: [{ url, alt }])
    const firstMedia = Array.isArray(media) ? media[0] : null;
    const imageUrl = firstMedia?.url || "/assets/images/default.svg"; // root-absolute
    const imageAlt = firstMedia?.alt || title;

    // Ends at (graceful fallback)
    const ends = endsAt ? new Date(endsAt) : null;
    const endsText =
      ends && !Number.isNaN(ends.getTime())
        ? ends.toLocaleString()
        : "Unknown";

    // Bids HTML
    const bidsHtml = bids.length
      ? bids
          .map(
            (b) =>
              `<li><span>${b.bidder?.name || "User"}</span> bid <strong>${b.amount} NOK</strong></li>`
          )
          .join("")
      : "<li>No bids yet.</li>";

    // Render
    listingContainer.innerHTML = `
      <div class="card">
        <img src="${imageUrl}" alt="${imageAlt}" class="card-img-top"
             onerror="this.src='/assets/images/default.svg'">
        <div class="card-body">
          <h2>${title}</h2>
          <p>${description || "No description available."}</p>
          <p><strong>Ends At:</strong> ${endsText}</p>
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
      "<p class='error-message'>Failed to load listing. Please try again later.</p>";
  }
}

/**
 * Handle bid submission.
 */
async function handleBid(event) {
  event.preventDefault();

  const bidAmountInput = document.getElementById("bid-amount");
  const bidAmount = parseInt(bidAmountInput.value, 10);
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (!bidAmount || Number.isNaN(bidAmount) || bidAmount <= 0) {
    alert("Please enter a valid bid amount.");
    return;
  }
  if (!listingId) {
    alert("Invalid listing ID.");
    return;
  }

  try {
    const accessToken = localStorage.getItem("accessToken");
    const apiKey = "424f3416-7ec1-4347-979f-87525187f9b9"; // same as profile.js (OK for school project)

    const response = await fetchFromApi(`auction/listings/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "X-Noroff-API-Key": apiKey, // remove if not required in your setup
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (response) {
      alert("Bid placed successfully!");
      bidAmountInput.value = "";
      loadListingDetails(); // refresh to show latest bids
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
  if (bidForm) bidForm.addEventListener("submit", handleBid);
});
