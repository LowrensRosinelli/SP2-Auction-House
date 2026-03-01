import { loginUser } from "../api/auth.js";
import { getProfile } from "../api/profiles.js";
import { setAuth, setProfile } from "../utils/storage.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

export function attachLoginEvents(form, messageContainer) {
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      showMessage(messageContainer, "Email and password are required.", "error");
      return;
    }

    try {
      const response = await loginUser({ email, password });
      const token = response.accessToken || response.token;
      const localProfile = {
        name: response.name,
        email: response.email,
        credits: response.credits,
        avatar: response.avatar,
        banner: response.banner,
        bio: response.bio
      };

      if (!token) {
        throw new Error("Missing token in login response");
      }

      setAuth({ token, profile: localProfile });

      try {
        const freshProfile = await getProfile(response.name);
        setProfile(freshProfile);
      } catch {
      }

      showMessage(messageContainer, "Login successful. Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/SP2-Auction-House/listings/";
      }, 400);
    } catch (error) {
      if (error.status === 401) {
        showMessage(messageContainer, "Invalid email or password. If this is an existing account, use the original password.", "error");
        return;
      }

      showMessage(messageContainer, error.message, "error");
    }
  });
}
