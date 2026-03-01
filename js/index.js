import { APP_NAME, APP_VERSION } from "./config.js";
import { clearAuth, getProfile, isLoggedIn } from "./utils/storage.js";

function setVisibility(element, visible) {
  if (!element) return;
  element.classList.toggle("hidden", !visible);
}

function setCredits(profile, forceHide = false) {
  const desktopCredits = document.getElementById("globalCredits");
  const mobileCredits = document.getElementById("globalCreditsMobile");

  if (profile && typeof profile.credits !== "undefined") {
    if (desktopCredits) {
      desktopCredits.textContent = `Credits: ${profile.credits}`;
    }
    if (mobileCredits) {
      mobileCredits.textContent = `Credits: ${profile.credits}`;
    }
  }

  const shouldShow = Boolean(profile) && typeof profile.credits !== "undefined" && !forceHide;
  setVisibility(desktopCredits, shouldShow);
  setVisibility(mobileCredits, shouldShow);
}

function attachLogout() {
  const desktopLogout = document.getElementById("logoutBtnDesktop");
  const mobileLogout = document.getElementById("logoutBtnMobile");

  [desktopLogout, mobileLogout].forEach((button) => {
    if (!button) return;

    button.addEventListener("click", () => {
      clearAuth();
      window.location.href = "/index.html";
    });
  });
}

function setupMobileMenu() {
  const menuButton = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden", isOpen);
  });
}

export function initAppShell() {
  document.title = `${document.title} | ${APP_NAME} v${APP_VERSION}`;

  const loggedIn = isLoggedIn();
  const profile = getProfile();

  setCredits(profile, !loggedIn);

  const desktopLogout = document.getElementById("logoutBtnDesktop");
  const mobileLogout = document.getElementById("logoutBtnMobile");

  setVisibility(desktopLogout, loggedIn);
  setVisibility(mobileLogout, loggedIn);

  attachLogout();
  setupMobileMenu();

  return { loggedIn, profile };
}

export function refreshShellProfile(profile) {
  setCredits(profile, false);
}
