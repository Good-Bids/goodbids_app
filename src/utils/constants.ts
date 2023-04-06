import { env } from "~/env.mjs";

export const initialOptions = {
  "client-id": env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};
