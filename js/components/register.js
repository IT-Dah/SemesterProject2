import { validateEmail, validatePasswords } from "../utils/form-validation.js";
import { setupResponsiveNavbar } from "../utils/dom-utils.js";

/**
 * Handles the registration form submission.
 * @param {Event} event - The form submission event.
 */
async function handleRegistration(event) {
  event.preventDefault();

  // Get form inputs
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Basic input validation
  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!validatePasswords(password, confirmPassword)) {
    alert("Passwords do not match or do not meet the required criteria.");
    return;
  }

  // Construct registration data
  const registrationData = {
    username,
    email,
    password,
  };

  try {
    // Make API request to register the user
    const response = await fetch(
      "https://api.noroff.dev/auction/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      alert(`Registration failed: ${errorData.message}`);
      return;
    }

    // On success
    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred while registering. Please try again later.");
  }
}

/**
 * Initialize the registration page.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Setup responsive navigation menu
  setupResponsiveNavbar();

  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", handleRegistration);
  } else {
    console.error("Registration form not found in the DOM.");
  }
});
