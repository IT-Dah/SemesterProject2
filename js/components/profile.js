import { fetchFromApi } from "../utils/api.js";

/**
 * Fetch and display profile data.
 * @param {string} profileName - The profile name to fetch.
 */
export async function loadProfile(profileName) {
  const profileContainer = document.getElementById("profile-container");
  profileContainer.innerHTML = "<p>Loading profile...</p>";

  try {
    const response = await fetchFromApi(
      `auction/profiles/${profileName}?_listings=true`
    );
    console.log("Profile data:", response);

    if (response) {
      const { name, email, bio, avatar, credits, listings, _count } = response;

      const avatarUrl = avatar?.url || "assets/images/default-avatar.svg";

      profileContainer.innerHTML = `
        <div class="profile-card">
          <img src="${avatarUrl}" alt="${name}'s avatar" class="profile-avatar">
          <h2>${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Credits:</strong> ${credits}</p>
          <p><strong>Bio:</strong> ${bio || "No bio available."}</p>
          <p><strong>Listings:</strong> ${_count.listings}</p>
        </div>
        <div id="user-listings">
          <h3>Your Listings</h3>
          <div class="row">
            ${listings
              .map((listing) => {
                const listingImage =
                  listing.media?.[0]?.url || "assets/images/default.svg";
                return `
                  <div class="col-md-4">
                    <div class="card">
                      <img src="${listingImage}" alt="${
                  listing.title
                }" class="card-img-top">
                      <div class="card-body">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="card-text">${
                          listing.description || "No description provided."
                        }</p>
                        <p class="card-text"><strong>Ends at:</strong> ${new Date(
                          listing.endsAt
                        ).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    } else {
      profileContainer.innerHTML = "<p>Failed to load profile data.</p>";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    profileContainer.innerHTML =
      "<p>Failed to load profile. Please try again later.</p>";
  }
}

/**
 * Update profile data (e.g., bio, avatar, banner).
 * @param {string} profileName - The profile name to update.
 * @param {object} data - The profile data to update.
 */
export async function updateProfile(profileName, data) {
  try {
    const response = await fetchFromApi(`auction/profiles/${profileName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response) {
      alert("Profile updated successfully.");
      loadProfile(profileName); // Reload the profile after update
    } else {
      alert("Failed to update profile.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating your profile.");
  }
}
