import { fetchFromApi } from "../utils/api.js";
import { setupResponsiveNavbar } from "../utils/menu.js";

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

      // Build profile HTML
      profileContainer.innerHTML = `
        <div class="profile-card">
          <img src="${avatarUrl}" alt="${name}'s avatar" class="profile-avatar" onerror="this.src='assets/images/default-avatar.svg';">
          <h2>${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Credits:</strong> ${credits}</p>
          <p><strong>Bio:</strong> ${bio || "No bio available."}</p>
          <p><strong>Listings:</strong> ${_count.listings}</p>
        </div>
      `;

      // Display listings if available
      const listingsContainer = document.getElementById("listings-container");
      if (listings?.length) {
        const listingsHtml = listings
          .map(
            (listing) => `
          <div class="listing-card">
            <h3>${listing.title || "Untitled"}</h3>
            <p>Ends: ${new Date(listing.endsAt).toLocaleString()}</p>
            <a href="details.html?id=${
              listing.id
            }" class="btn btn-primary">View Details</a>
          </div>`
          )
          .join("");
        listingsContainer.innerHTML = listingsHtml;
      } else {
        listingsContainer.innerHTML = "<p>No active listings found.</p>";
      }
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

/**
 * Initialize the profile page.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Replace "yourProfileName" with dynamic logic to fetch the user's profile name
  const profileName = localStorage.getItem("username"); // Example: Fetch from localStorage or an API
  if (!profileName) {
    alert("No profile name found. Please log in.");
    window.location.href = "login.html";
    return;
  }

  loadProfile(profileName);

  const updateProfileForm = document.getElementById("update-profile-form");
  if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Collect form data
      const bio = document.getElementById("bio").value;
      const avatarUrl = document.getElementById("avatar-url").value;
      const bannerUrl = document.getElementById("banner-url").value;

      const data = {};
      if (bio) data.bio = bio;
      if (avatarUrl) data.avatar = { url: avatarUrl };
      if (bannerUrl) data.banner = { url: bannerUrl };

      // Update profile
      updateProfile(profileName, data);
    });
  }

  // Setup the responsive navigation menu
  setupResponsiveNavbar();
});
