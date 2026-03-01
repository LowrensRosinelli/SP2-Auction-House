import { formatDate } from "../utils/formatDate.js";

export function renderBidList(bids = []) {
  if (!bids.length) {
    return "<p class=\"text-sm muted-copy\">No bids yet.</p>";
  }

  const sorted = [...bids].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  return `
    <ul class="space-y-2">
      ${sorted
        .map(
          (bid) => `
            <li class="rounded-sm border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-3 py-2 text-sm">
              <div class="flex items-center justify-between gap-2">
                <span class="font-medium">${bid.bidder?.name || "Unknown bidder"}</span>
                <span>${bid.amount} credits</span>
              </div>
              <p class="text-xs muted-copy">${formatDate(bid.created)}</p>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}
