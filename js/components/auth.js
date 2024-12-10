// js/components/auth.js
import { fetchFromApi } from "../utils/api.js";

export async function loginUser(email, password) {
  try {
    const response = await fetchFromApi("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response) {
      localStorage.setItem("accessToken", response.accessToken); // Save token
      alert("Login successful!");
      window.location.href = "profile.html"; // Redirect after login
    } else {
      alert("Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    alert("An error occurred while logging in.");
  }
}
