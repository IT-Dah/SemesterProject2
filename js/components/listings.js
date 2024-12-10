import { fetchListings } from "../utils/api.js";
import { createCard } from "../utils/dom-utils.js";

export async function loadListings(
  limit = 10,
  page = 1,
  sort = "endsAt",
  sortOrder = "asc"
) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "<p>Loading listings...</p>";

  try {
    const listings = await fetchListings(limit, page, sort, sortOrder);
    cardContainer.innerHTML = ""; // Clear placeholder
    listings.forEach((listing) =>
      cardContainer.appendChild(createCard(listing))
    );
  } catch (error) {
    cardContainer.innerHTML =
      "<p>Failed to load listings. Please try again later.</p>";
  }
}
