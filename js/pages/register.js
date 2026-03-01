import { attachRegisterEvents } from "../events/registerEvents.js";
import { initAppShell } from "../index.js";
import { requireGuest } from "../utils/authGuard.js";

if (requireGuest()) {
  initAppShell();
  attachRegisterEvents(document.getElementById("registerForm"), document.getElementById("authMessage"));
}
