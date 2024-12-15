import { loadListings } from "./components/listings.js";
import { setupResponsiveNavbar } from "./utils/menu.js";
import { loginUser, registerUser } from "./components/auth.js";

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
 * Remove the spinner from a specific container.
 * @param {string} containerId - The ID of the container to remove the spinner from.
 */
function removeSpinner(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const spinner = container.querySelector(".spinner");
    if (spinner) spinner.remove();
  }
}

/**
 * Dynamically load HTML components (e.g., header, footer).
 * @param {string} id - The ID of the placeholder div.
 * @param {string} filePath - The path to the HTML file to load.
 */
async function loadComponent(id, filePath) {
  const placeholder = document.getElementById(id);
  if (!placeholder) {
    console.error(`Placeholder with ID '${id}' not found.`);
    return;
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load '${filePath}': ${response.statusText}`);
    }

    placeholder.innerHTML = await response.text();

    // Initialize the navbar if the header is loaded
    if (id === "header-placeholder") {
      setupResponsiveNavbar();
    }
  } catch (error) {
    console.error(`Error loading component from '${filePath}':`, error);
    placeholder.innerHTML = `<p>Error loading component. Please try again later.</p>`;
  }
}

/**
 * Initialize the index page.
 */
async function initializeIndexPage() {
  try {
    showLoading("card-container");
    await loadListings(12, 1, "endsAt", "asc");
    removeSpinner("card-container");
  } catch (error) {
    console.error("Error initializing index page:", error);
    alert("Failed to load listings. Please refresh the page.");
  }
}

/**
 * Initialize the register page.
 */
function initializeRegisterPage() {
  const form = document.getElementById("register-form");
  if (!form) {
    console.error("Register form not found.");
    return;
  }

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

    try {
      await registerUser(username, email, password);
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert(error.message || "Registration failed. Please try again.");
    }
  });
}

/**
 * Initialize the login page.
 */
function initializeLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) {
    console.error("Login form not found.");
    return;
  }

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
      console.error("Login Error:", error.message);
      alert(error.message || "Login failed. Please try again.");
    }
  });
}

/**
 * Initialize the profile page.
 */
async function initializeProfilePage() {
  console.log("Profile page initialization logic can be added here.");
}

/**
 * Initialize the application based on the current page.
 */
async function initializeApp() {
  try {
    // Dynamically load header and footer
    await loadComponent("header-placeholder", "/src/components/header.html");
    await loadComponent("footer-placeholder", "/src/components/footer.html");

    // Determine the current page and initialize accordingly
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html") || currentPage === "/") {
      await initializeIndexPage();
    } else if (currentPage.includes("register.html")) {
      initializeRegisterPage();
    } else if (currentPage.includes("login.html")) {
      initializeLoginPage();
    } else if (currentPage.includes("profile.html")) {
      await initializeProfilePage();
    }
  } catch (error) {
    console.error("Error initializing the application:", error);
    alert("An error occurred while loading the application. Please try again.");
  }
}

// Run the initialization after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
