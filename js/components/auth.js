import { fetchFromApi } from "../utils/api.js";

/**
 * Logs in a user by sending credentials to the API.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>}
 */
export async function loginUser(email, password) {
  try {
    // Input validation
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    console.log("Attempting to log in with:", { email });

    // API call
    const response = await fetchFromApi("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Handle successful login
    if (response?.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken); // Save access token
      localStorage.setItem("username", response.data.name); // Save username
      localStorage.setItem("userData", JSON.stringify(response.data)); // Save full user data

      alert("Login successful! Redirecting to your profile...");
      setTimeout(() => {
        window.location.href = "/src/profile/profile.html"; // Updated redirect path
      }, 2000);
    } else {
      const errorMessage =
        response?.message || "Login failed. Please check your credentials.";
      console.error("Login Error:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("Login Error:", error.message || error);
    alert(
      "An unexpected error occurred while logging in. Please try again later."
    );
  }
}

/**
 * Registers a new user by sending data to the API.
 * @param {string} username - The user's chosen username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>}
 */
export async function registerUser(username, email, password) {
  try {
    // Input validation
    if (!username || !/^[a-zA-Z0-9_]{3,}$/.test(username)) {
      throw new Error(
        "Username must be at least 3 characters long and contain only letters, numbers, or underscores."
      );
    }
    if (!email || !email.endsWith("stud.noroff.no")) {
      throw new Error("Email must be a valid @stud.noroff.no address.");
    }
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const registrationData = {
      name: username,
      email,
      password,
    };

    console.log("Payload for registration:", registrationData);

    // API call
    const response = await fetchFromApi("auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    // Handle successful registration
    if (response?.data?.name) {
      console.log("Registration successful:", response.data);
      alert("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/src/auth/login.html"; // Redirect to login page
      }, 2000);
    } else {
      const errorMessage =
        response?.message || "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Registration Error:", error.message || error);
    alert(error.message || "An unexpected error occurred during registration.");
  }
}
