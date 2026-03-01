import { getProfile, getProfileListings, getListingsBidOn } from "../api/profiles.js";
import { attachProfileFormEvents } from "../events/profileEvents.js";
import { initAppShell, refreshShellProfile } from "../index.js";
import { renderProfile } from "../ui/renderProfile.js";
import { showMessage } from "../ui/showMessage.js";
import { requireAuth } from "../utils/authGuard.js";
import { setProfile } from "../utils/storage.js";

if (requireAuth()) {
  const { profile } = initAppShell();
  const messageContainer = document.getElementById("profileMessage");

  loadProfilePage(profile ? profile.name : "", messageContainer);
}

function fillProfileForm(profile) {
  const form = document.getElementById("profileForm");
  if (!form) return;

  form.elements.bio.value = profile.bio || "";
  form.elements.avatarUrl.value = profile.avatar?.url || "";
  form.elements.avatarAlt.value = profile.avatar?.alt || "";
  form.elements.bannerUrl.value = profile.banner?.url || "";
  form.elements.bannerAlt.value = profile.banner?.alt || "";
}

async function loadProfilePage(profileName, messageContainer) {
  if (!profileName) {
    showMessage(messageContainer, "Profile not found in local storage.", "error");
    return;
  }

  try {
    const profileHeader = document.getElementById("profileHeader");
    const myListingsBox = document.getElementById("myListings");
    const bidOnListingsBox = document.getElementById("bidOnListings");
    const profileForm = document.getElementById("profileForm");

    const [profile, myListings, bidOnListings] = await Promise.all([
      getProfile(profileName),
      getProfileListings(profileName),
      getListingsBidOn(profileName)
    ]);

    setProfile(profile);
    refreshShellProfile(profile);

    profileHeader.innerHTML = renderProfile(profile);
    fillProfileForm(profile);

    myListingsBox.innerHTML = Array.isArray(myListings) && myListings.length
      ? myListings.map((listing) => `<a class="list-link" href="/listing/index.html?id=${listing.id}">${listing.title}</a>`).join("")
      : '<p class="text-sm muted-copy">No listings yet.</p>';

    const bidListings = Array.isArray(bidOnListings) ? bidOnListings.map((bid) => bid.listing || bid) : [];
    const validBidListings = bidListings.filter((listing) => listing && listing.id);

    bidOnListingsBox.innerHTML = validBidListings.length
      ? validBidListings
          .map((listing) => `<a class="list-link" href="/listing/index.html?id=${listing.id}">${listing.title}</a>`)
          .join("")
      : '<p class="text-sm muted-copy">No bids yet.</p>';

    attachProfileFormEvents({
      form: profileForm,
      messageContainer,
      profileName,
      onSaved: (updatedProfile) => {
        setProfile(updatedProfile);
        refreshShellProfile(updatedProfile);
        profileHeader.innerHTML = renderProfile(updatedProfile);
        fillProfileForm(updatedProfile);
      }
    });
  } catch (error) {
    showMessage(messageContainer, error.message, "error");
  }
}
