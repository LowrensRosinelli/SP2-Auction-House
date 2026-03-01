import { attachCreateListingFormEvents } from "../events/listingEvents.js";
import { initAppShell } from "../index.js";
import { requireAuth } from "../utils/authGuard.js";

if (requireAuth()) {
  initAppShell();

  attachCreateListingFormEvents({
    form: document.getElementById("createListingForm"),
    addButton: document.getElementById("addMediaBtn"),
    mediaContainer: document.getElementById("mediaInputsContainer"),
    messageContainer: document.getElementById("createListingMessage"),
    mediaError: document.getElementById("mediaError"),
    deadlineError: document.getElementById("deadlineError"),
    counterElement: document.getElementById("mediaCounter")
  });
}
