import {
  loadListings,
  setupPagination,
  setupSorting,
} from "./components/listings.js";
import { registerUser } from "./components/register.js";
import { loginUser } from "./components/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  loadListings(); // Load listings on page load
  setupPagination();
  setupSorting();
});
