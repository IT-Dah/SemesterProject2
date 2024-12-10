import { loadListings, setupPagination } from "./components/listings.js";

document.addEventListener("DOMContentLoaded", () => {
  loadListings();
  setupPagination();
});
