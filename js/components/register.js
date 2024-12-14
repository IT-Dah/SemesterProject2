import { validateEmail, validatePasswords } from "../utils/form-validation.js";
import { setupResponsiveNavbar } from "../utils/dom-utils.js";

/**
 * Displays feedback messages to the user.
 * @param {string} message - The message to display.
 * @param {boolean} isSuccess - Whether it's a success or error message.
 */
function displayAlert(message, isSuccess) {
  const feedbackMessage = document.getElementById("feedback-message");
  if (feedbackMessage) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback ${isSuccess ? "success" : "error"}`;
    feedbackMessage.style.display = "block";

    // Auto-hide the message after 5 seconds
    setTimeout(() => {
      feedbackMessage.style.display = "none";
    }, 5000);
  } else {
    alert(message); // Fallback alert
  }
}

/**
 * Handles the registration form submission.
 * @param {Event} event - The form submission event.
 */
async function handleRegistration(event) {
  event.preventDefault(); // Prevent form default submission
  console.log("Form submission intercepted.");

  // Get form inputs
  const name = document.getElementById("username")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirm-password")?.value;

  // Validate inputs
  if (!name || name.length < 3) {
    displayAlert("Username must be at least 3 characters long.", false);
    return;
  }
  if (!validateEmail(email)) {
    displayAlert(
      "Please enter a valid email address ending with @stud.noroff.no.",
      false
    );
    return;
  }
  if (!validatePasswords(password, confirmPassword)) {
    displayAlert("Passwords do not match or are invalid.", false);
    return;
  }

  // Prepare registration data
  const registrationData = { name, email, password };
  console.log("Registration data:", registrationData);

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      const errorMessage =
        errorData.errors?.[0]?.message || "An unexpected error occurred.";
      displayAlert(`Registration failed: ${errorMessage}`, false);
      return;
    }

    displayAlert("Registration successful! Redirecting to login...", true);
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 2000);
  } catch (error) {
    console.error("Error during registration:", error);
    displayAlert(
      "An error occurred while registering. Please try again later.",
      false
    );
  }
}

/**
 * Initialize the registration page.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing register page...");
  setupResponsiveNavbar();

  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", handleRegistration);
  } else {
    console.error("Registration form not found in the DOM.");
  }
});
