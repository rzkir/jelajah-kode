import midtransClient from "midtrans-client";

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error("NEXT_PUBLIC_MIDTRANS_MIDTRANS_SERVER_KEY is not defined");
}

if (!process.env.MIDTRANS_CLIENT_KEY) {
  throw new Error("MIDTRANS_CLIENT_KEY is not defined");
}

// Create Snap API instance
export const snap = new midtransClient.Snap({
  // Set to true if you're using production environment
  isProduction: false,
  // Use Server Key for backend operations
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  // Use Client Key for frontend operations
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Create Core API instance for transaction status checking
export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
