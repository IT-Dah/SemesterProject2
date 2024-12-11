/**
 * Initializes a responsive navigation menu with toggle functionality.
 * @param {string} menuButtonSelector - Selector for the menu toggle button.
 * @param {string} navbarMenuSelector - Selector for the navbar menu.
 */
export function setupResponsiveNavbar(
  menuButtonSelector = ".menu-icon button",
  navbarMenuSelector = ".navbar-menu"
) {
  const menuButton = document.querySelector(menuButtonSelector);
  const navbarMenu = document.querySelector(navbarMenuSelector);

  if (!menuButton || !navbarMenu) {
    console.error("Menu button or navbar menu not found!");
    return;
  }

  // Toggle menu visibility
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("show");
  });

  // Hide menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !navbarMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("show");
    }
  });

  // Ensure proper state on window resize (e.g., removing `show` for larger screens)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("show");
    }
  });
}
