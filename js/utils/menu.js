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

  // Close the menu if clicked outside or on a menu item
  document.addEventListener("click", (event) => {
    const clickedOutside =
      !event.target.closest(".menu-icon") &&
      !event.target.closest(".navbar-menu");

    const clickedMenuItem = event.target.closest(".navbar-menu ul li a");

    if (
      navbarMenu.classList.contains("active") &&
      (clickedOutside || clickedMenuItem)
    ) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("active");
    }
  });

  // Adjust menu visibility on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuButton.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("active");
    }
  });
}
