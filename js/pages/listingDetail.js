import { getProfile } from "../api/profiles.js";
import { getListingById } from "../api/listings.js";
import { attachBidEvents } from "../events/bidEvents.js";
import { attachOwnerListingEvents } from "../events/listingEvents.js";
import { initAppShell, refreshShellProfile } from "../index.js";
import { renderBidList } from "../ui/renderBidList.js";
import { showMessage } from "../ui/showMessage.js";
import { formatDate } from "../utils/formatDate.js";
import { setProfile } from "../utils/storage.js";

function resolveListingId() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  if (queryId) return queryId;

  const segments = window.location.pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment || lastSegment === "listing" || lastSegment === "index.html") {
    return null;
  }

  return lastSegment;
}

const { profile } = initAppShell();
const listingId = resolveListingId();

const messageContainer = document.getElementById("listingMessage");
const detailContainer = document.getElementById("listingDetail");
const bidHistoryContainer = document.getElementById("bidHistory");
const bidSection = document.getElementById("bidSection");
const ownerSection = document.getElementById("ownerSection");

if (!listingId) {
  showMessage(messageContainer, "Listing ID missing in route.", "error");
} else {
  loadListing();
}

async function loadListing() {
  try {
    const listing = await getListingById(listingId);

    const mediaItems = Array.isArray(listing.media) ? listing.media : [];
    const mainImage = mediaItems[0]?.url;
    const mainAlt = mediaItems[0]?.alt || listing.title;
    const gallery = mediaItems.length
      ? mediaItems
          .map(
            (item) =>
              `<img class="aspect-[4/5] w-full rounded-sm object-cover" src="${item.url}" alt="${item.alt || listing.title}" />`
          )
          .join("")
      : '<p class="text-sm muted-copy">No media uploaded.</p>';

    detailContainer.innerHTML = `
      <div class="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div class="lot-media-wrap">
          ${
            mainImage
              ? `<img class="lot-image" src="${mainImage}" alt="${mainAlt}" />`
              : '<div class="lot-placeholder"><span>No image</span></div>'
          }
        </div>
        <div class="space-y-5">
          <p class="lot-meta-label">Seller · ${listing.seller?.name || "Unknown seller"}</p>
          <h1 class="auction-detail-title">${listing.title}</h1>
          <p class="text-sm muted-copy">Ends ${formatDate(listing.endsAt)}</p>
          <p class="text-sm leading-relaxed">${listing.description || "No description"}</p>
        </div>
      </div>
      <div class="mt-6 border-t border-[color:var(--border-soft)] pt-6">
        <h2 class="mb-3 font-serif text-3xl leading-none">Gallery</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${gallery}</div>
      </div>
    `;

    bidHistoryContainer.innerHTML = renderBidList(listing.bids || []);

    const isOwner = profile?.name && listing.seller?.name === profile.name;
    const canBid = Boolean(profile) && !isOwner;
    bidSection.classList.toggle("hidden", !canBid);
    ownerSection.classList.toggle("hidden", !isOwner);

    if (canBid) {
      attachBidEvents({
        form: document.getElementById("bidForm"),
        messageContainer: document.getElementById("bidMessage"),
        listingId,
        onBidSuccess: async () => {
          await loadListing();
          await refreshCredits();
        }
      });
    }

    if (isOwner) {
      attachOwnerListingEvents({
        form: document.getElementById("ownerListingForm"),
        deleteButton: document.getElementById("deleteListingBtn"),
        messageContainer: document.getElementById("ownerListingMessage"),
        listing,
        onUpdated: async () => {
          await loadListing();
        },
        onDeleted: () => {
          window.location.href = "/profile";
        }
      });
    }
  } catch (error) {
    showMessage(messageContainer, error.message, "error");
  }
}

async function refreshCredits() {
  if (!profile?.name) return;

  try {
    const freshProfile = await getProfile(profile.name);
    setProfile(freshProfile);
    refreshShellProfile(freshProfile);
  } catch {
    // Keep listing flow working even if credits refresh fails.
  }
}
