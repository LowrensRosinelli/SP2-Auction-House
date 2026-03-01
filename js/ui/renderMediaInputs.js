export function renderMediaInputs(container, mediaRows, options = {}) {
  if (!container) return;

  const maxRecommended = options.maxRecommended ?? 10;
  const counterElement = options.counterElement ?? null;

  container.innerHTML = mediaRows
    .map(
      (row, index) => `
        <div class="rounded-sm border border-[color:var(--border-soft)] bg-[color:var(--surface)] p-3" data-row-index="${index}">
          <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <label class="label" for="mediaUrl_${index}">Image URL ${index + 1}</label>
              <input
                class="input"
                id="mediaUrl_${index}"
                name="mediaUrl_${index}"
                type="url"
                placeholder="https://example.com/image.jpg"
                value="${row.url || ""}"
              />
            </div>
            <div>
              <label class="label" for="mediaAlt_${index}">Alt text (optional)</label>
              <input
                class="input"
                id="mediaAlt_${index}"
                name="mediaAlt_${index}"
                type="text"
                maxlength="120"
                placeholder="Optional image description"
                value="${row.alt || ""}"
              />
            </div>
            <div class="flex items-end">
              <button class="btn-secondary w-full" type="button" data-action="remove-media" data-index="${index}">
                Remove
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  if (counterElement) {
    const suffix = mediaRows.length > maxRecommended ? " (above recommended)" : "";
    counterElement.textContent = `${mediaRows.length}/${maxRecommended}${suffix}`;
  }
}
