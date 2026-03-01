import { updateProfile } from "../api/profiles.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

function buildImageField(url, alt) {
  if (!url) return null;
  return {
    url,
    alt: alt || ""
  };
}

export function attachProfileFormEvents({ form, messageContainer, profileName, onSaved }) {
  if (!form || !profileName) return;

  form.onsubmit = async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);

    const formData = new FormData(form);
    const bio = String(formData.get("bio") || "").trim();
    const avatarUrl = String(formData.get("avatarUrl") || "").trim();
    const avatarAlt = String(formData.get("avatarAlt") || "").trim();
    const bannerUrl = String(formData.get("bannerUrl") || "").trim();
    const bannerAlt = String(formData.get("bannerAlt") || "").trim();

    if (bio.length > 160) {
      showMessage(messageContainer, "Bio must be 160 characters or less.", "error");
      return;
    }

    const payload = {
      bio,
      avatar: buildImageField(avatarUrl, avatarAlt),
      banner: buildImageField(bannerUrl, bannerAlt)
    };

    try {
      const updatedProfile = await updateProfile(profileName, payload);
      showMessage(messageContainer, "Profile updated.", "success");

      if (typeof onSaved === "function") {
        onSaved(updatedProfile);
      }
    } catch (error) {
      showMessage(messageContainer, error.message, "error");
    }
  };
}
