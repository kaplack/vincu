/**
 * Generates a deterministic QR payload for a customer.
 * This value is intended to be encoded in the customer's Wallet pass.
 *
 * Format: vincu:<businessId>:<phone>
 */
function buildCustomerQrValue({ businessId, phone }) {
  const safePhone = String(phone || "").replace(/\s+/g, "").trim();
  return `vincu:${businessId}:${safePhone}`;
}

module.exports = { buildCustomerQrValue };
