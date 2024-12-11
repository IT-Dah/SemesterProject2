import { loadListings, setupPagination } from "./components/listings.js";
import { setupResponsiveNavbar } from "./utils/menu.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize the responsive navigation menu
    setupResponsiveNavbar();

    // Load and display listings on page load
    loadListings(12, 1, "endsAt", "asc");

    // Set up pagination for the listings
    setupPagination();
  } catch (error) {
    console.error("Error initializing the application:", error);
    alert("An error occurred while loading the page. Please try again.");
  }
});
