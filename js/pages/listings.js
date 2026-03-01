import { attachListingsPageEvents } from "../events/listingEvents.js";
import { initAppShell } from "../index.js";

const { loggedIn } = initAppShell();

const createCta = document.getElementById("createListingCta");
if (createCta) {
  createCta.classList.toggle("hidden", !loggedIn);
}
attachListingsPageEvents({
  filterForm: document.getElementById("listingsFilterForm"),
  resetButton: document.getElementById("resetFiltersBtn"),
  listingsGrid: document.getElementById("listingsGrid"),
  messageContainer: document.getElementById("listingsMessage"),
  countElement: document.getElementById("listingsCount"),
  chipsElement: document.getElementById("activeFilterChips"),
  searchInput: document.getElementById("searchInput"),
  categoryInput: document.getElementById("categoryInput"),
  sortSelect: document.getElementById("sortSelect"),
  sortOrderSelect: document.getElementById("sortOrderSelect")
});
