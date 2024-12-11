/**
 * Setup a responsive navigation menu toggle for mobile view.
 */
export function setupResponsiveNavbar() {
  const menuToggle = document.querySelector(".menu-icon button");
  const navbarMenu = document.querySelector(".navbar-menu");

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    navbarMenu.classList.toggle("show");
  });

  // Close the menu when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !navbarMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      menuToggle.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("show");
    }
  });
}
