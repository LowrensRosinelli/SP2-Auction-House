import { initAppShell } from "../index.js";
import { attachLoginEvents } from "../events/loginEvents.js";
import { attachRegisterEvents } from "../events/registerEvents.js";
import { requireGuest } from "../utils/authGuard.js";

if (requireGuest()) {
  initAppShell();

  const messageContainer = document.getElementById("authMessage");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  attachLoginEvents(loginForm, messageContainer);
  attachRegisterEvents(registerForm, messageContainer);
}
