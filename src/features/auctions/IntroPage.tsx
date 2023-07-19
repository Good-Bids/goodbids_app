import Link from "next/link";
import Vimeo from "@vimeo/player";
import { IframeHTMLAttributes, useEffect, useRef, useState } from "react";
import {
  charityColor,
  charityColorTailwindString,
  prizeVideoUrls,
} from "~/utils/constants";

type VideoState = "initial" | "playing" | "paused" | "ended";

interface IntroPageProps {
  prize: "watch" | "trek";
}

export const IntroPage = (props: IntroPageProps) => {
  const { prize } = props;
  const vimeoUrl = prizeVideoUrls[prize];
  useEffect(() => {
    if (window) {
      window.localStorage.setItem(`hasSeenIntroFor${prize}`, "true");
      window.localStorage.setItem("auctionSource", prize);
    }
  }, []);

  const charity = "buildOn";

  const colorString = charityColorTailwindString[charity];

  return (
    <div className="mx-4 my-6 flex h-full flex-col items-center gap-6 overflow-visible md:mt-[-32px] md:h-fit md:gap-2">
      <div className="flex w-[90%] flex-col gap-2 md:h-fit">
        <p className={`text-${colorString} text-4xl font-bold`}>
          Your generosity deserves a prize
        </p>
        <p className="my-2 text-sm font-normal text-outerSpace-900">
          Welcome to a new kind of charity auction where every bid is a donation
          and your generosity can win you prizes!
        </p>
      </div>
      <div className="flex aspect-video w-full flex-col items-center justify-center">
        <iframe
          src={vimeoUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          style={{
            width: "100%",
            height: "100%",
          }}
          title="buildOn and GoodBids"
        />
      </div>
      <Link href={`/${prize}`}>
        <button
          className={`bg-${colorString} container flex w-full flex-col items-stretch justify-center rounded px-4 py-2 text-xl font-bold text-white md:w-fit md:px-8`}
        >
          <p>Go to the Auction</p>
        </button>
      </Link>
    </div>
  );
};
