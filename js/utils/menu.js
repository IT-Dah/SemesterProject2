export function setupResponsiveNavbar() {
  const menuButton = document.querySelector(".menu-icon button");
  const navbarMenu = document.querySelector(".navbar-menu");
  const authButtonContainer = document.getElementById("auth-button-container");

  // Ensure required elements exist in the DOM
  if (!menuButton || !navbarMenu || !authButtonContainer) {
    console.error("One or more navbar elements are missing in the DOM.");
    return;
  }

  // Toggle the menu on button click
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("active");
  });

  // Close the menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      navbarMenu.classList.contains("active") &&
      !event.target.closest(".menu-icon") &&
      !event.target.closest(".navbar-menu")
    ) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("active");
    }
  });

  // Dynamically create and manage the Sign In/Out button
  updateAuthButton(authButtonContainer);
}

/**
 * Updates the authentication button and "My Profile" link based on user login status.
 * @param {HTMLElement} authButtonContainer - The container element for the auth button.
 */
function updateAuthButton(authButtonContainer) {
  const accessToken = localStorage.getItem("accessToken");
  const username = localStorage.getItem("username");

  if (accessToken) {
    // User is signed in
    authButtonContainer.innerHTML = `
      <li>
        <a href="../../src/profile/profile.html" class="btn btn-info">
          <i class="fas fa-user"></i> My Profile
        </a>
      </li>
      <li>
        <button class="btn btn-secondary" id="sign-out-button">
          <i class="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </li>
    `;
    const signOutButton = document.getElementById("sign-out-button");
    signOutButton.addEventListener("click", () => handleSignOut());
  } else {
    // User is signed out
    authButtonContainer.innerHTML = `
      <li>
        <a href="../../src/auth/login.html" class="btn btn-primary">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </a>
      </li>
    `;
  }
}

/**
 * Handles the sign-out process.
 */
function handleSignOut() {
  localStorage.clear(); // Clear all stored user data
  alert("You have been signed out.");
  window.location.href = "../../src/home/index.html"; // Redirect to home page
}
