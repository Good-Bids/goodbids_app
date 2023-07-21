import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { auctionTitleImages } from "~/utils/constants";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const prize = searchParams.get("prize") ?? "trek";
  const imageUrl =
    prize === "watch" ? auctionTitleImages.watch : auctionTitleImages.trek;

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex" }}>
        <img src={imageUrl} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
