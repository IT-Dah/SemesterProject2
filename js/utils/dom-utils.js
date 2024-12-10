export function createCard(listing) {
  const card = document.createElement("div");
  card.className = "col-md-4 card";

  card.innerHTML = `
      <img src="${listing.media[0] || "assets/images/default.svg"}" alt="${
    listing.title
  }" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${listing.title}</h5>
        <p class="card-text">${
          listing.description || "No description available"
        }</p>
        <a href="details.html?id=${
          listing.id
        }" class="btn btn-primary">View Details</a>
      </div>
    `;
  return card;
}
