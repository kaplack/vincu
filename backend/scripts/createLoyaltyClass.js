// scripts/createLoyaltyClass.js
const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

async function main() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const keyPath = process.env.GOOGLE_WALLET_SA_KEY_PATH;

  if (!issuerId || !keyPath) {
    throw new Error(
      "Missing env vars: GOOGLE_WALLET_ISSUER_ID or GOOGLE_WALLET_SA_KEY_PATH"
    );
  }

  // Google Wallet Objects API scope
  const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });

  const client = await auth.getClient();
  const accessToken = (await client.getAccessToken()).token;

  // IMPORTANT: IDs must be globally unique within your issuer.
  // Use a stable naming convention: {issuerId}.loyaltyClass.{businessSlugOrId}
  const businessId = "cosa_nostra"; // o tu ID interno
  const classId = `${issuerId}.loy_${businessId}`;

  const payload = {
    id: classId,
    issuerName: "VINCU",
    programName: "Cosa Nostra Loyalty",
    // Basic branding (puedes mejorarlo luego)
    reviewStatus: "UNDER_REVIEW", // en demo/testing suele ser OK
    // Ejemplo de campos que verás en la tarjeta
    // (Luego los afinamos con tu diseño real)
    programLogo: {
      sourceUri: {
        uri: "https://drive.google.com/file/d/1dz7sS833WZs0MQyniogWStqEBYSLEkqj",
      },
      contentDescription: {
        defaultValue: { language: "es-PE", value: "Logo" },
      },
    },
  };

  const url =
    "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass";

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Loyalty Class created!");
    console.log(res.data);
  } catch (err) {
    // Si ya existe, Google devuelve error; eso es normal.
    console.error("❌ Error creating loyalty class:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

main();
