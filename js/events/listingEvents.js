import { createListing, deleteListing, getListings, updateListing } from "../api/listings.js";
import {
  renderEmptyListingsState,
  renderListingCards,
  renderListingSkeletons
} from "../ui/renderListingCard.js";
import { renderMediaInputs } from "../ui/renderMediaInputs.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

const MIN_MEDIA_ITEMS = 7;
const RECOMMENDED_MAX_MEDIA_ITEMS = 10;

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export async function loadAndRenderListings(filters, uiRefs) {
  const { listingsGrid, messageContainer, countElement } = uiRefs;

  try {
    clearMessage(messageContainer);
    listingsGrid.innerHTML = renderListingSkeletons(6);
    if (countElement) {
      countElement.textContent = "Loading lots...";
    }

    const listings = await getListings(filters);
    const safeListings = Array.isArray(listings) ? listings : [];

    if (countElement) {
      countElement.textContent = `${safeListings.length} lot${safeListings.length === 1 ? "" : "s"}`;
    }

    if (!safeListings.length) {
      listingsGrid.innerHTML = renderEmptyListingsState();
      return;
    }

    listingsGrid.innerHTML = renderListingCards(safeListings);
  } catch (error) {
    listingsGrid.innerHTML = "";
    if (countElement) {
      countElement.textContent = "0 lots";
    }
    showMessage(messageContainer, error.message, "error");
  }
}

export function attachListingsPageEvents(refs) {
  const {
    filterForm,
    resetButton,
    listingsGrid,
    messageContainer,
    countElement,
    searchInput,
    categoryInput,
    sortSelect,
    sortOrderSelect
  } = refs;

  if (!filterForm || !listingsGrid) return;

  const readFilters = () => ({
    q: searchInput?.value?.trim() || "",
    tag: categoryInput?.value?.trim() || "",
    sort: sortSelect?.value || "created",
    sortOrder: sortOrderSelect?.value || "desc"
  });

  filterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadAndRenderListings(readFilters(), { listingsGrid, messageContainer, countElement });
  });

  resetButton?.addEventListener("click", async () => {
    filterForm.reset();
    await loadAndRenderListings(readFilters(), { listingsGrid, messageContainer, countElement });
  });

  listingsGrid.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "emptyResetBtn") {
      filterForm.reset();
      await loadAndRenderListings(readFilters(), { listingsGrid, messageContainer, countElement });
    }
  });

  loadAndRenderListings(readFilters(), { listingsGrid, messageContainer, countElement });
}

export function attachCreateListingFormEvents(refs) {
  const {
    form,
    addButton,
    mediaContainer,
    messageContainer,
    mediaError,
    deadlineError,
    counterElement
  } = refs;

  if (!form || !addButton || !mediaContainer) return;

  let mediaRows = [{ url: "", alt: "" }];

  function syncFromDom() {
    mediaRows = mediaRows.map((_, index) => {
      const urlInput = form.querySelector(`#mediaUrl_${index}`);
      const altInput = form.querySelector(`#mediaAlt_${index}`);

      return {
        url: urlInput?.value?.trim() || "",
        alt: altInput?.value?.trim() || ""
      };
    });
  }

  function renderRows() {
    renderMediaInputs(mediaContainer, mediaRows, {
      maxRecommended: RECOMMENDED_MAX_MEDIA_ITEMS,
      counterElement
    });
  }

  addButton.addEventListener("click", () => {
    syncFromDom();
    mediaRows.push({ url: "", alt: "" });
    renderRows();
  });

  mediaContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.action !== "remove-media") return;

    const index = Number(target.dataset.index);
    if (Number.isNaN(index)) return;

    syncFromDom();

    if (mediaRows.length === 1) {
      return;
    }

    mediaRows = mediaRows.filter((_, currentIndex) => currentIndex !== index);
    renderRows();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);
    if (mediaError) mediaError.textContent = "";
    if (deadlineError) deadlineError.textContent = "";

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const endsAtRaw = String(formData.get("endsAt") || "").trim();

    if (!title || !endsAtRaw) {
      showMessage(messageContainer, "Title and deadline are required.", "error");
      return;
    }

    const endsAt = new Date(endsAtRaw);
    if (Number.isNaN(endsAt.getTime()) || endsAt <= new Date()) {
      if (deadlineError) deadlineError.textContent = "Deadline must be a valid future date/time.";
      showMessage(messageContainer, "Please fix validation errors.", "error");
      return;
    }

    syncFromDom();

    const nonEmptyRows = mediaRows.filter((row) => row.url.length > 0);
    const invalidRows = nonEmptyRows.filter((row) => !isValidUrl(row.url));

    if (invalidRows.length > 0) {
      if (mediaError) mediaError.textContent = "One or more image URLs are invalid.";
      showMessage(messageContainer, "Please fix validation errors.", "error");
      return;
    }

    if (nonEmptyRows.length < MIN_MEDIA_ITEMS) {
      if (mediaError) mediaError.textContent = `Please add at least ${MIN_MEDIA_ITEMS} valid image URLs.`;
      showMessage(messageContainer, "Please fix validation errors.", "error");
      return;
    }

    const media = nonEmptyRows.map((row, index) => ({
      url: row.url,
      alt: row.alt || `${title} image ${index + 1}`
    }));

    const payload = {
      title,
      description,
      endsAt: endsAt.toISOString(),
      media
    };

    try {
      const created = await createListing(payload);
      showMessage(messageContainer, "Listing created. Redirecting...", "success");
      const id = created?.id;
      setTimeout(() => {
        window.location.href = id ? `/listing/index.html?id=${id}` : "/listings";
      }, 450);
    } catch (error) {
      showMessage(messageContainer, error.message, "error");
    }
  });

  renderRows();
}

export function attachOwnerListingEvents({ form, deleteButton, messageContainer, listing, onUpdated, onDeleted }) {
  if (!form || !deleteButton || !listing) return;

  form.elements.title.value = listing.title || "";
  form.elements.description.value = listing.description || "";

  if (listing.endsAt) {
    const date = new Date(listing.endsAt);
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localDateTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
    form.elements.endsAt.value = localDateTime;
  }

  form.onsubmit = async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const endsAtRaw = String(formData.get("endsAt") || "").trim();

    if (!title || !endsAtRaw) {
      showMessage(messageContainer, "Title and deadline are required.", "error");
      return;
    }

    const endsAtDate = new Date(endsAtRaw);
    if (Number.isNaN(endsAtDate.getTime())) {
      showMessage(messageContainer, "Deadline is invalid.", "error");
      return;
    }

    try {
      const updatedListing = await updateListing(listing.id, {
        title,
        description,
        endsAt: endsAtDate.toISOString()
      });

      showMessage(messageContainer, "Listing updated.", "success");

      if (onUpdated) {
        await onUpdated(updatedListing);
      }
    } catch (error) {
      showMessage(messageContainer, error.message, "error");
    }
  };

  deleteButton.onclick = async () => {
    const confirmed = window.confirm("Delete this listing? This cannot be undone.");
    if (!confirmed) return;

    clearMessage(messageContainer);

    try {
      await deleteListing(listing.id);
      showMessage(messageContainer, "Listing deleted.", "success");

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      showMessage(messageContainer, error.message, "error");
    }
  };
}
