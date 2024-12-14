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
  container.innerHTML = '<div class="spinner">Loading...</div>';
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
      return;
    }

    const content = await response.text();
    placeholder.innerHTML = content;

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
    await loadComponent(
      "header-placeholder",
      "../../src/components/header.html"
    );
    await loadComponent(
      "footer-placeholder",
      "../../src/components/footer.html"
    );

    showLoading("card-container");

    await loadListings(12, 1, "endsAt", "asc");

    const spinner = document.querySelector(".spinner");
    if (spinner) spinner.remove();

    setupPagination();
  } catch (error) {
    console.error("Error initializing the application:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
