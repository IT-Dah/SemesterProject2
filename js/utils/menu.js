// js/utils/menu.js

function initNavbarOnce() {
  const menuButton = document.querySelector(".menu-icon button");
  const navbarMenu = document.querySelector(".navbar-menu");
  const authButtonContainer = document.getElementById("auth-button-container");

  if (!menuButton || !navbarMenu || !authButtonContainer) {
    return false; // header not injected yet
  }

  // Toggle menu on button click
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    navbarMenu.classList.toggle("active");
  });

  // Close when clicking outside
  document.addEventListener("click", (evt) => {
    if (
      navbarMenu.classList.contains("active") &&
      !evt.target.closest(".menu-icon") &&
      !evt.target.closest(".navbar-menu")
    ) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("active");
    }
  });

  // Build the auth buttons
  updateAuthButton(authButtonContainer);

  return true;
}

export function setupResponsiveNavbar() {
  // Try now…
  if (initNavbarOnce()) return;

  // …otherwise try again on the next frame (header just got injected)
  requestAnimationFrame(() => {
    initNavbarOnce();
  });
}

function updateAuthButton(container) {
  const accessToken = localStorage.getItem("accessToken");
  // const username = localStorage.getItem("username"); // if you want to show it

  if (accessToken) {
    container.innerHTML = `
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
    if (signOutButton) {
      signOutButton.addEventListener("click", () => {
        localStorage.clear();
        alert("You have been signed out.");
        window.location.href = "../../src/home/index.html";
      });
    }
  } else {
    container.innerHTML = `
      <li>
        <a href="../../src/auth/login.html" class="btn btn-primary">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </a>
      </li>
      <li>
        <a href="../../src/auth/register.html" class="btn btn-primary">
          <i class="fas fa-user-plus"></i> Register
        </a>
      </li>
    `;
  }
}
