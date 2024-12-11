/**
 * Setup a responsive navigation menu toggle for mobile view.
 */
export function setupResponsiveNavbar() {
  const menuToggle = document.querySelector(".menu-icon button");
  const navbar = document.querySelector(".navbar");

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
    navbar.classList.toggle("show");
  });
}
