import { formatDate } from "../utils/formatDate.js";

function getHighestBid(bids = []) {
  if (!Array.isArray(bids) || bids.length === 0) return 0;
  return Math.max(...bids.map((bid) => Number(bid.amount) || 0));
}

function hasUsableImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function renderListingCard(listing) {
  const imageUrl = listing.media?.[0]?.url || "";
  const imageAlt = listing.media?.[0]?.alt || listing.title || "Listing image";
  const highestBid = getHighestBid(listing.bids);
  const bidsCount = listing.bids?.length || 0;
  const sellerName = listing.seller?.name || "Unknown seller";
  const title = listing.title || "Untitled listing";
  const endDate = new Date(listing.endsAt);
  const isEnded = Number.isFinite(endDate.getTime()) && endDate < new Date();
  const hasImage = hasUsableImageUrl(imageUrl);

  const millisecondsLeft = endDate.getTime() - Date.now();
  const hoursLeft = Math.max(0, Math.floor(millisecondsLeft / 3600000));
  const minutesLeft = Math.max(0, Math.floor((millisecondsLeft % 3600000) / 60000));
  const timeLabel = isEnded ? "Ended" : `${hoursLeft}h ${minutesLeft}m left`;

  return `
    <article class="lot-card">
      <a class="lot-card-link" href="/SP2-Auction-House/listing/index.html?id=${listing.id}" aria-label="View details for ${title}">
        <div class="lot-media-wrap">
          ${isEnded ? '<span class="lot-ended-badge">Ended</span>' : ""}
          ${
            hasImage
              ? `<img class="lot-image" src="${imageUrl}" alt="${imageAlt}" loading="lazy" />`
              : `
                <div class="lot-placeholder">
                  <svg aria-hidden="true" viewBox="0 0 24 24" class="h-8 w-8">
                    <path fill="currentColor" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Zm1.5-.5a.5.5 0 0 0-.5.5v9.77l4.33-4.33a1 1 0 0 1 1.41 0l2.26 2.26 2.88-2.88a1 1 0 0 1 1.41 0L19 12.01V5.5a.5.5 0 0 0-.5-.5h-13Zm13 14a.5.5 0 0 0 .5-.5v-5.07l-2.29-2.29-2.88 2.88a1 1 0 0 1-1.41 0L10 12.35l-5 5V18.5a.5.5 0 0 0 .5.5h13Z"/>
                  </svg>
                  <span>No image</span>
                </div>
              `
          }
        </div>

        <div class="space-y-4 p-4">
          <p class="lot-meta-label">Seller · ${sellerName}</p>
          <h3 class="lot-card-title">${title}</h3>

          <div class="border-t border-[color:var(--border-soft)] pt-4">
            <p class="lot-meta-label">Current bid</p>
            <p class="mt-1 text-3xl font-semibold leading-none">${highestBid} credits</p>
          </div>

          <div class="flex items-center justify-between text-sm text-[color:var(--muted)]">
            <p>${timeLabel}</p>
            <p>${bidsCount} bids</p>
          </div>
          <p class="text-xs text-[color:var(--muted)]">Ends ${formatDate(listing.endsAt)}</p>

          <span class="lot-link">View lot →</span>
        </div>
        ${
          isEnded
            ? '<span class="sr-only">Auction ended</span>'
            : ""
        }
      </a>
    </article>
  `;
}

export function renderListingCards(listings = []) {
  return listings.map((listing) => renderListingCard(listing)).join("");
}

export function renderListingSkeletons(count = 6) {
  return Array.from({ length: count }, () => `
    <article class="lot-card p-0">
      <div class="skeleton mb-4 aspect-[4/5] w-full"></div>
      <div class="space-y-2">
        <div class="skeleton h-3 w-24"></div>
        <div class="skeleton h-6 w-3/4"></div>
        <div class="skeleton mt-5 h-3 w-20"></div>
        <div class="skeleton h-6 w-1/2"></div>
        <div class="skeleton mt-4 h-3 w-full"></div>
      </div>
    </article>
  `).join("");
}

export function renderEmptyListingsState() {
  return `
    <article class="empty-state sm:col-span-2 xl:col-span-3">
      <h3 class="text-xl font-semibold">No lots matched your filters</h3>
      <p class="mt-2 text-sm text-[color:var(--muted)]">Try broadening your search or clearing filters.</p>
      <button id="emptyResetBtn" class="lot-link mt-4 text-base" type="button">Reset filters</button>
    </article>
  `;
}
