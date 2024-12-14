import { fetchFromApi } from "/js/utils/api.js";

/**
 * Logs in a user by sending credentials to the API.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
export async function loginUser(email, password) {
  try {
    if (!email || !password) {
      alert("Both email and password are required.");
      return;
    }

    const response = await fetchFromApi("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response?.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      alert("Login successful! Redirecting to your profile...");
      window.location.href = "/src/profile/profile.html";
    } else if (response?.message) {
      alert(`Login failed: ${response.message}`);
    } else {
      alert("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("An error occurred during login. Please try again later.");
  }
}
