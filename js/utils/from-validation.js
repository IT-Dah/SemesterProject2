export function validatePasswords(password, confirmPassword) {
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true;
}

export function validateEmail(email) {
  const domain = "stud.noroff.no";
  if (!email.endsWith(domain)) {
    alert(`Email must end with @${domain}`);
    return false;
  }
  return true;
}
