import { validateEmail, validatePasswords } from "../utils/form-validation.js";
import { setupResponsiveNavbar } from "../utils/dom-utils.js";

/**
 * Handles the registration form submission.
 * @param {Event} event - The form submission event.
 */
async function handleRegistration(event) {
  event.preventDefault();

  // Get form inputs
  const name = document.getElementById("username")?.value.trim(); // Matches API requirements
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirm-password")?.value;

  // Basic input validation
  if (!name || name.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address ending with @stud.noroff.no.");
    return;
  }

  if (!validatePasswords(password, confirmPassword)) {
    alert(
      "Passwords do not match or do not meet the required criteria (min. 8 characters)."
    );
    return;
  }

  // Construct registration data
  const registrationData = {
    name, // Matches required API field
    email,
    password,
  };

  try {
    // Correct API endpoint
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration error:", errorData);

      // Improved error handling with specific message
      const errorMessage =
        errorData.errors?.[0]?.message ||
        "An unexpected error occurred. Please try again.";
      alert(`Registration failed: ${errorMessage}`);
      return;
    }

    // On success
    alert("Registration successful! Redirecting to login...");
    window.location.href = "../auth/login.html"; // Updated path for redirect
  } catch (error) {
    console.error("Error during registration:", error);
    alert(
      "An error occurred while registering. Please check your internet connection and try again."
    );
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
