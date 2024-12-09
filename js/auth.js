const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate email ends with stud.noroff.no
  if (!email.endsWith("stud.noroff.no")) {
    alert("Please use a stud.noroff.no email.");
    return;
  }

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/auction/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
  }
});
