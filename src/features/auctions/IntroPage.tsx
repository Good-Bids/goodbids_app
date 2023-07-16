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
  const [videoState, setVideoState] = useState<VideoState>("initial");
  const vimeoUrl = prizeVideoUrls[prize];
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (window) {
      // if (window.localStorage) {
      setWidth(window.innerWidth * 0.75);
      window.localStorage.setItem(`hasSeenIntroFor${prize}`, "true");
      window.localStorage.setItem("auctionSource", prize);
      // }
    }
  }, []);

  const charity = "buildOn";

  const colorString = charityColorTailwindString[charity];

  const textPrompt: Record<VideoState, string> = {
    initial: "Here's the deal",
    playing: "",
    paused: "Resume",
    ended: "Restart",
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const player = !!iframeRef.current && new Vimeo(iframeRef.current);

  const clickHandler = async () => {
    if (player !== false) {
      if (["paused", "initial"].includes(videoState)) {
        await player.play();
        setVideoState("playing");
      } else {
        console.log("this should pause");
        await player.pause();
        setVideoState("paused");
      }
    }
  };

  return (
    <div className="mx-4 my-6 flex h-full flex-col items-center gap-6 overflow-visible md:h-fit md:gap-2">
      <div className="flex w-full flex-col gap-4 md:h-fit">
        <p className={`text-${colorString} text-4xl font-bold`}>
          Your generosity deserves a prize!
        </p>
        <p className="text-xl font-normal text-outerSpace-900">
          Welcome to a new kind of charity auction where every bid is a donation
          and your generosity can win you prizes!
        </p>
      </div>
      <div className="flex aspect-video w-[85%] flex-col items-center justify-center">
        {/* <div
          className={`relative top-1/2 flex h-0 w-fit flex-row items-center justify-center gap-2 self-center bg-outerSpace-900 bg-opacity-30 px-4 ${
            videoState === "playing" ? "hidden h-0" : "visible inline"
          }`}
        >
          <p className={`text-xl font-bold text-white`}>
            {textPrompt[videoState]}
          </p>
          <svg width="24" height="24">
            <path
              d="M10.8556 8.15498C10.0225 7.69354 9 8.29608 9 9.24847V14.7516C9 15.704 10.0225 16.3065 10.8556 15.8451L16.6134 12.6561C16.852 12.524 17 12.2727 17 12C17 11.7273 16.852 11.4761 16.6134 11.3439L10.8556 8.15498ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12Z"
              fill="white"
            />
          </svg>
        </div> */}
        <div className="aspect-video w-full">
          <iframe
            src={vimeoUrl}
            allow="autoplay; fullscreen; picture-in-picture"
            style={{
              width: "100%",
              height: "100%",
            }}
            title="Buildon and goodbids 2"
            ref={iframeRef}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-stretch md:items-center">
        <Link href={"/SignUp"}>
          <button
            className={`bg-${colorString} container flex w-full flex-col items-stretch justify-center rounded px-4 py-2 text-xl font-bold text-white md:w-fit md:px-8`}
          >
            <p>Sign Up</p>
          </button>
        </Link>
      </div>
      <Link href={`/${prize}`}>
        <div className="flex w-full flex-row justify-center gap-2">
          <p className="text-${colorString} inline-flex text-xl font-bold underline">
            Go to the auction
          </p>
          <svg width="25" height="25">
            <path
              d="M14.1149 4.31891C13.815 4.03322 13.3403 4.04476 13.0546 4.34469C12.7689 4.64461 12.7804 5.11935 13.0804 5.40504L19.3318 11.3596H4.59766C4.18344 11.3596 3.84766 11.6954 3.84766 12.1096C3.84766 12.5239 4.18344 12.8596 4.59766 12.8596H19.3319L13.0804 18.8144C12.7804 19.1 12.7689 19.5748 13.0546 19.8747C13.3403 20.1746 13.815 20.1862 14.1149 19.9005L21.5339 12.8338C21.7028 12.6729 21.8027 12.4676 21.8337 12.2543C21.8429 12.2075 21.8477 12.1591 21.8477 12.1096C21.8477 12.0601 21.8428 12.0116 21.8337 11.9647C21.8026 11.7515 21.7027 11.5464 21.5339 11.3856L14.1149 4.31891Z"
              fill={`${charityColor[charity]}`}
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};
