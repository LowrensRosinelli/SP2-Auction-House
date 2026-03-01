import { registerUser } from "../api/auth.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

const STUDENT_EMAIL_PATTERN = /^[^\s@]+@stud\.noroff\.no$/i;
const NAME_ALLOWED_PATTERN = /^[A-Za-z0-9_]+$/;

function sanitizeName(value) {
  return value.trim().replace(/\s+/g, "");
}

export function attachRegisterEvents(form, messageContainer) {
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);

    const formData = new FormData(form);
    const rawName = String(formData.get("name") || "");
    const name = sanitizeName(rawName);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!name) {
      showMessage(messageContainer, "Name is required.", "error");
      return;
    }

    if (!NAME_ALLOWED_PATTERN.test(name)) {
      showMessage(
        messageContainer,
        "Name can only contain letters, numbers, and underscore (_). No punctuation allowed.",
        "error"
      );
      return;
    }

    if (!STUDENT_EMAIL_PATTERN.test(email)) {
      showMessage(messageContainer, "You must use a @stud.noroff.no email.", "error");
      return;
    }

    if (password.length < 8) {
      showMessage(messageContainer, "Password must be at least 8 characters.", "error");
      return;
    }

    try {
      await registerUser({ name, email, password });
      showMessage(messageContainer, "Registration successful. You can now log in.", "success");
      form.reset();
    } catch (error) {
      const message = String(error.message || "");

      if (message.toLowerCase().includes("already exists")) {
        showMessage(
          messageContainer,
          "Profile already exists. Use a different @stud.noroff.no email (for example add numbers to your name).",
          "error"
        );
        return;
      }

      showMessage(messageContainer, message || "Registration failed. Please try again.", "error");
    }
  });
}
