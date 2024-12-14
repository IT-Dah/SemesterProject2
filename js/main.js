import { loadListings, setupPagination } from "./components/listings.js";
import { setupResponsiveNavbar } from "./utils/menu.js";
import { loginUser } from "./components/auth.js"; // Import login logic if needed

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
 * Initialize the index page.
 */
async function initializeIndexPage() {
  try {
    showLoading("card-container");
    await loadListings(12, 1, "endsAt", "asc");

    // Remove spinner after listings are loaded
    const spinner = document.querySelector(".spinner");
    if (spinner) spinner.remove();

    setupPagination();
  } catch (error) {
    console.error("Error initializing index page:", error);
    alert("Failed to load listings. Please refresh the page.");
  }
}

/**
 * Initialize the register page.
 */
async function initializeRegisterPage() {
  console.log("Initializing register page...");
  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (!username || !email || !password || password !== confirmPassword) {
        alert("Please fill in all fields and ensure passwords match.");
        return;
      }

      // Call the registration API (example function)
      try {
        // Replace `registerUser` with your actual implementation
        const result = await registerUser(username, email, password);
        alert(result.message || "Registration successful!");
        window.location.href = "/src/auth/login.html";
      } catch (error) {
        alert(error.message || "Registration failed. Please try again.");
      }
    });
  } else {
    console.error("Register form not found.");
  }
}

/**
 * Initialize the login page.
 */
async function initializeLoginPage() {
  console.log("Initializing login page...");
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        await loginUser(email, password);
      } catch (error) {
        alert(error.message || "Login failed. Please try again.");
      }
    });
  } else {
    console.error("Login form not found.");
  }
}

/**
 * Initialize the application.
 */
async function initializeApp() {
  try {
    // Dynamically load header and footer for all pages
    await loadComponent("header-placeholder", "/src/components/header.html");
    await loadComponent("footer-placeholder", "/src/components/footer.html");

    // Determine which page is being loaded based on the URL
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html") || currentPage === "/") {
      await initializeIndexPage();
    } else if (currentPage.includes("register.html")) {
      await initializeRegisterPage();
    } else if (currentPage.includes("login.html")) {
      await initializeLoginPage();
    }
  } catch (error) {
    console.error("Error initializing the application:", error);
    alert("An error occurred while loading the application. Please try again.");
  }
}

// Run the initialization after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
