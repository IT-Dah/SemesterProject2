import { fetchFromApi } from "../utils/api.js";

/**
 * Logs in a user by sending credentials to the API.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
export async function loginUser(email, password) {
  try {
    // Validate input before making the API call
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    const response = await fetchFromApi("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Handle API response
    if (response?.accessToken) {
      localStorage.setItem("accessToken", response.accessToken); // Save token securely
      alert("Login successful!");
      window.location.href = "/src/profile/index.html"; // Redirect to the profile page
    } else if (response?.message) {
      alert(`Login failed: ${response.message}`);
    } else {
      alert("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    alert("An unexpected error occurred. Please try again later.");
  }
}
