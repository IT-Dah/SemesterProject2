import { fetchFromApi } from "../utils/api.js";

export async function registerUser(data) {
  try {
    const response = await fetchFromApi("auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (response) {
      alert("Registration successful!");
    }
  } catch (error) {
    console.error("Error registering user:", error.message);
  }
}
