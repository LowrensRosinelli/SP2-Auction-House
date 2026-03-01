import { placeBid } from "../api/bids.js";
import { clearMessage, showMessage } from "../ui/showMessage.js";

export function attachBidEvents({ form, messageContainer, listingId, onBidSuccess }) {
  if (!form) return;

  form.onsubmit = async (event) => {
    event.preventDefault();
    clearMessage(messageContainer);

    const formData = new FormData(form);
    const amount = Number(formData.get("amount"));

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage(messageContainer, "Bid amount must be greater than 0.", "error");
      return;
    }

    try {
      await placeBid(listingId, amount);
      showMessage(messageContainer, "Bid placed successfully.", "success");
      form.reset();

      if (typeof onBidSuccess === "function") {
        await onBidSuccess();
      }
    } catch (error) {
      showMessage(messageContainer, error.message, "error");
    }
  };
}
