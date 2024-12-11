/**
 * Sets up a responsive navigation menu with toggle functionality.
 * @param {string} menuToggleSelector - CSS selector for the menu toggle button.
 * @param {string} navbarMenuSelector - CSS selector for the navbar menu.
 */
export function setupResponsiveNavbar(
  menuToggleSelector = ".menu-icon button",
  navbarMenuSelector = ".navbar-menu"
) {
  const menuToggle = document.querySelector(menuToggleSelector);
  const navbarMenu = document.querySelector(navbarMenuSelector);

  if (!menuToggle || !navbarMenu) {
    console.error("Menu toggle button or navbar menu not found.");
    return;
  }

  // Toggle menu visibility
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("show");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !navbarMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      menuToggle.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("show");
    }
  });

  // Ensure proper state on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuToggle.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("show");
    }
  });
}
