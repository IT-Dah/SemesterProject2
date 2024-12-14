/**
 * Validates if the provided password and confirmation match and meet complexity criteria.
 * @param {string} password - The password to validate.
 * @param {string} confirmPassword - The confirmation password to validate.
 * @returns {boolean} - True if the passwords match and are valid, false otherwise.
 */
export function validatePasswords(password, confirmPassword) {
  const minPasswordLength = 8;
  const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // At least one letter, one number, 8+ characters

  if (!password || !passwordCriteria.test(password)) {
    alert(
      `Password must be at least ${minPasswordLength} characters long, and include at least one letter and one number.`
    );
    return false;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }

  return true;
}

/**
 * Validates if the provided email matches the required domain format.
 * @param {string} email - The email to validate.
 * @param {string} domain - Optional domain to validate against (default: "stud.noroff.no").
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export function validateEmail(email, domain = "stud.noroff.no") {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // General email validation regex

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!email.endsWith(`@${domain}`)) {
    alert(`Email must end with @${domain}.`);
    return false;
  }

  return true;
}
