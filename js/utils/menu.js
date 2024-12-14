/**
 * Sets up the responsive navigation menu functionality.
 */
export function setupResponsiveNavbar() {
  const menuButton = document.querySelector(".menu-icon button");
  const navbarMenu = document.querySelector(".navbar-menu");

  if (!menuButton || !navbarMenu) {
    console.error("Menu button or navbar menu not found in the DOM.");
    return;
  }

  // Toggle the menu on button click
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("active");
  });

  // Close the menu if clicked outside
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
}
