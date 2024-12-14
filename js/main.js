import { loadListings, setupPagination } from "./components/listings.js";
import { setupResponsiveNavbar } from "./utils/menu.js";

/**
 * Display a loading spinner in the specified container.
 * @param {string} containerId - The ID of the container to display the spinner in.
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found.`);
    return;
  }
  container.innerHTML = `
    <div class="spinner" role="status" aria-live="polite">
      <span class="visually-hidden">Loading...</span>
    </div>`;
}

/**
 * Dynamically load HTML components (e.g., header, footer).
 * @param {string} id - The ID of the placeholder div.
 * @param {string} filePath - The path to the HTML file to load.
 */
async function loadComponent(id, filePath) {
  try {
    const placeholder = document.getElementById(id);
    if (!placeholder) {
      console.error(`Placeholder with ID '${id}' not found.`);
      return;
    }

    const response = await fetch(filePath);
    if (!response.ok) {
      console.error(`Failed to load '${filePath}': ${response.statusText}`);
      placeholder.innerHTML = `<p>Error loading component. Please try again later.</p>`;
      return;
    }

    const content = await response.text();
    placeholder.innerHTML = content;

    // Setup the responsive navbar after the header is loaded
    if (id === "header-placeholder") {
      setupResponsiveNavbar();
    }
  } catch (error) {
    console.error(`Error loading '${filePath}':`, error);
  }
}

/**
 * Initialize the application.
 */
async function initializeApp() {
  try {
    // Dynamically load header and footer for all pages
    await loadComponent(
      "header-placeholder",
      "../../src/components/header.html"
    );
    await loadComponent(
      "footer-placeholder",
      "../../src/components/footer.html"
    );

    // Determine which page is being loaded based on the URL
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html") || currentPage === "/") {
      // Index page logic: Show spinner, load listings, and setup pagination
      showLoading("card-container");
      await loadListings(12, 1, "endsAt", "asc");

      // Remove spinner after listings are loaded
      const spinner = document.querySelector(".spinner");
      if (spinner) spinner.remove();

      setupPagination();
    } else if (currentPage.includes("register.html")) {
      console.log("Initializing register page...");
      // Add any register-specific initialization logic here
    } else if (currentPage.includes("login.html")) {
      console.log("Initializing login page...");
      // Add any login-specific initialization logic here
    }
  } catch (error) {
    console.error("Error initializing the application:", error);
    alert("An error occurred while loading the application. Please try again.");
  }
}

// Run the initialization after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
