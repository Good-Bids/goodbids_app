import { env } from "~/env.mjs";

export type Ein = `${number}`;

type EinCheckResponse = {
  public_charity: boolean;
  ein: Ein;
};

export const checkEin: (ein: Ein) => Promise<EinCheckResponse> = async (
  ein
) => {
  const url = `https://api.charityapi.org/api/public_charity_check/${ein}`;
  const headers = new Headers({ apikey: env.NEXT_PUBLIC_CHARITY_API_KEY });
  const response: Promise<EinCheckResponse> = await (
    await fetch(url, { method: "GET", headers })
  ).json();
  return response;
};
