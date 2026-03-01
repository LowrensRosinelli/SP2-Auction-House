const typeClassMap = {
  success: "alert border-emerald-300 bg-emerald-50 text-emerald-800",
  error: "alert border-rose-300 bg-rose-50 text-rose-800",
  info: "alert border-stone-300 bg-stone-100 text-stone-700"
};

export function showMessage(container, message, type = "info") {
  if (!container) return;
  container.innerHTML = `<p class="${typeClassMap[type] || typeClassMap.info}">${message}</p>`;
}

export function clearMessage(container) {
  if (!container) return;
  container.innerHTML = "";
}
