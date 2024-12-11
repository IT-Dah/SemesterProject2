import { loadListings, setupPagination } from "./components/listings.js";
import { setupResponsiveNavbar } from "./utils/dom-utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Load and display listings on page load
  loadListings(12, 1, "endsAt", "asc"); // Default: 12 listings, sorted by end date ascending

  // Set up pagination for the listings
  setupPagination();

  // Initialize the responsive navigation menu
  setupResponsiveNavbar();
});
