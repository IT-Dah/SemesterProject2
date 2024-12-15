import { fetchFromApi } from "../utils/api.js";

/**
 * Fetch and display profile data.
 */
async function fetchAndDisplayProfile() {
  const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
  const apiKey = "424f3416-7ec1-4347-979f-87525187f9b9"; // Replace with your API key
  const username = localStorage.getItem("username") || "puddingtv32"; // Retrieve dynamically

  if (!accessToken) {
    console.error("No access token found. Redirecting to login.");
    window.location.href = "/src/auth/login.html";
    return;
  }

  const endpoint = `social/profiles/${username}?_posts=true&_followers=true&_following=true`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  };

  try {
    // Fetch profile data from the API
    const response = await fetchFromApi(endpoint, options);
    const { data } = response;

    // Update DOM with profile data
    updateProfileHeader(data);
    updateProfileCounts(data);

    console.log("Profile data loaded successfully:", data);
  } catch (error) {
    console.error("Error fetching profile data:", error.message || error);
    alert("Failed to load profile. Please try again later.");
  }
}

/**
 * Safely update a DOM element's text content.
 * @param {string} selector - CSS selector for the target element.
 * @param {string} value - The text content to set.
 * @param {string} fallback - Fallback text if value is empty.
 */
function safeSetTextContent(selector, value, fallback = "") {
  const element = document.querySelector(selector);
  if (element) {
    element.innerText = value || fallback;
  } else {
    console.warn(`Element with selector '${selector}' not found.`);
  }
}

/**
 * Safely update a DOM element's image source and alt text.
 * @param {string} selector - CSS selector for the target image element.
 * @param {string} src - The image URL.
 * @param {string} alt - The alt text for the image.
 * @param {string} fallbackSrc - Fallback image URL.
 * @param {string} fallbackAlt - Fallback alt text.
 */
function safeSetImageSrc(selector, src, alt, fallbackSrc, fallbackAlt) {
  const element = document.querySelector(selector);
  if (element) {
    element.src = src || fallbackSrc;
    element.alt = alt || fallbackAlt;
  } else {
    console.warn(`Image element with selector '${selector}' not found.`);
  }
}

/**
 * Update the profile header with avatar, name, email, and bio.
 * @param {object} data - Profile data from API.
 */
function updateProfileHeader(data) {
  safeSetImageSrc(
    "#profile-avatar",
    data.avatar?.url,
    data.avatar?.alt || "User Avatar",
    "/assets/images/default-avatar.svg",
    "Default Avatar"
  );
  safeSetTextContent("#profile-name", data.name, "Unknown User");
  safeSetTextContent("#profile-email", data.email, "No email provided");
  safeSetTextContent("#profile-bio", data.bio, "This user has no bio yet.");
}

/**
 * Update profile statistics (posts, followers, following).
 * @param {object} data - Profile data with _count information.
 */
function updateProfileCounts(data) {
  safeSetTextContent("#post-count", data._count?.posts, "0");
  safeSetTextContent("#followers-count", data._count?.followers, "0");
  safeSetTextContent("#following-count", data._count?.following, "0");
}

// Run function after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndDisplayProfile);
