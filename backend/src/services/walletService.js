const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT } = require("google-auth-library");

const { GOOGLE_WALLET_ENABLED, GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, GOOGLE_WALLET_PRIVATE_KEY } = require("../config/env");
const { Business, Customer } = require("../models");
const { getCustomerBalance } = require("./pointsService");

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_BASE = "https://walletobjects.googleapis.com/walletobjects/v1";

function assertWalletEnabled() {
  if (!GOOGLE_WALLET_ENABLED) {
    const err = new Error("Google Wallet integration is not enabled");
    err.status = 501;
    throw err;
  }
  if (!GOOGLE_WALLET_ISSUER_ID || !GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL || !GOOGLE_WALLET_PRIVATE_KEY) {
    const err = new Error("Google Wallet is enabled but missing env vars (GOOGLE_WALLET_ISSUER_ID, GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL, GOOGLE_WALLET_PRIVATE_KEY)");
    err.status = 500;
    throw err;
  }
}

function getJwtClient() {
  const key = GOOGLE_WALLET_PRIVATE_KEY.replace(/\\n/g, "\n");
  return new JWT({
    email: GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
    key,
    scopes: [WALLET_SCOPE],
  });
}

async function walletRequest(method, url, data) {
  const client = getJwtClient();
  const { token } = await client.getAccessToken();
  return axios({
    method,
    url,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
}

function classIdForBusiness(businessId) {
  return `${GOOGLE_WALLET_ISSUER_ID}.vincu_business_${businessId}`;
}

function objectIdForCustomer(customerId) {
  return `${GOOGLE_WALLET_ISSUER_ID}.vincu_customer_${customerId}`;
}

async function ensureLoyaltyClass({ businessId }) {
  const id = classIdForBusiness(businessId);
  const business = await Business.findByPk(businessId);
  if (!business) {
    const err = new Error("Business not found");
    err.status = 404;
    throw err;
  }

  // Check if exists
  try {
    await walletRequest("GET", `${WALLET_BASE}/loyaltyClass/${encodeURIComponent(id)}`);
    return id;
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }

  const payload = {
    id,
    issuerName: business.name,
    programName: `${business.name} Loyalty`,
    reviewStatus: "UNDER_REVIEW",
  };

  await walletRequest("POST", `${WALLET_BASE}/loyaltyClass`, payload);
  return id;
}

async function ensureLoyaltyObject({ businessId, customerId }) {
  const id = objectIdForCustomer(customerId);
  const classId = classIdForBusiness(businessId);
  const customer = await Customer.findOne({ where: { id: customerId, businessId } });
  if (!customer) {
    const err = new Error("Customer not found");
    err.status = 404;
    throw err;
  }

  // Check if exists
  try {
    await walletRequest("GET", `${WALLET_BASE}/loyaltyObject/${encodeURIComponent(id)}`);
    return { id, classId };
  } catch (e) {
    if (e?.response?.status !== 404) throw e;
  }

  const balance = await getCustomerBalance({ businessId, customerId });

  const payload = {
    id,
    classId,
    state: "ACTIVE",
    accountId: customer.phone,
    accountName: customer.name || customer.phone,
    barcode: {
      type: "QR_CODE",
      value: customer.qrCodeValue,
    },
    textModulesData: [
      {
        header: "Puntos",
        body: String(balance.toFixed(2)),
        id: "points_balance",
      },
    ],
  };

  await walletRequest("POST", `${WALLET_BASE}/loyaltyObject`, payload);
  return { id, classId };
}

/**
 * Generates the "Add to Google Wallet" save link (JWT) for a given customer.
 */
async function generateAddToWalletLink({ businessId, customerId }) {
  assertWalletEnabled();

  const classId = await ensureLoyaltyClass({ businessId });
  const obj = await ensureLoyaltyObject({ businessId, customerId });

  const key = GOOGLE_WALLET_PRIVATE_KEY.replace(/\\n/g, "\n");
  const claims = {
    iss: GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
    aud: "google",
    typ: "savetowallet",
    payload: {
      loyaltyObjects: [{ id: obj.id }],
      loyaltyClasses: [{ id: classId }],
    },
  };

  const token = jwt.sign(claims, key, { algorithm: "RS256" });
  return { url: `https://pay.google.com/gp/v/save/${token}` };
}

/**
 * Syncs the customer's point balance into the Wallet pass.
 */
async function syncCustomerPass({ businessId, customerId }) {
  assertWalletEnabled();

  await ensureLoyaltyClass({ businessId });
  const obj = await ensureLoyaltyObject({ businessId, customerId });

  const balance = await getCustomerBalance({ businessId, customerId });

  const patch = {
    textModulesData: [
      {
        header: "Puntos",
        body: String(balance.toFixed(2)),
        id: "points_balance",
      },
    ],
  };

  await walletRequest("PATCH", `${WALLET_BASE}/loyaltyObject/${encodeURIComponent(obj.id)}`, patch);
  return { ok: true, balance };
}

module.exports = { generateAddToWalletLink, syncCustomerPass };
