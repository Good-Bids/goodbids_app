import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  goodBidsIntroVideo,
  prizeShortDescriptions,
  prizeValue,
  prizeVideoUrls,
} from "~/utils/constants";

const Home = () => {
  const router = useRouter();
  const [showHome, setShowHome] = useState(false);
  const [introVideoDimensions, setIntroVideoDimensions] = useState("0px");
  useEffect(() => {
    if (window) {
      // if the user has come from the redirect page
      if (window.localStorage.getItem("hasComefromRedirectPage") !== null) {
        // remove the cookie (prevents future redirects)
        window.localStorage.deleteItem("hasComefromRedirectPage");
        const auctionSource = window.localStorage.getItem("auctionSource");
        if (auctionSource !== null) {
          switch (auctionSource) {
            case "watch":
              router.push("/watch");
              break;
            case "trek":
              router.push("/trek");
              break;
          }
        }
        // if the user gets to the home page in any other way
      } else {
        setShowHome(true);
      }
    }
  }, []);
  const prizes = ["Trek", "Watch"];

  return (
    <div className="flex h-full w-11/12 flex-col flex-nowrap items-center justify-center">
      {showHome && (
        <div className="align-center flex h-fit w-full flex-col flex-nowrap justify-start gap-8 overflow-y-auto sm:h-fit sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-12">
          {prizes.map((prize) => {
            const lowercasePrize = prize.toLowerCase() as "trek" | "watch";
            return (
              <Link
                href={`/${lowercasePrize}`}
                className="container mt-4 flex h-fit w-full flex-col rounded sm:h-[450px] sm:w-2/5 sm:justify-between sm:gap-6 sm:border sm:px-4 sm:py-8 sm:drop-shadow"
              >
                <p className="my-0 text-center text-2xl font-bold text-bo-red underline">
                  The {prize} Auction
                </p>
                <div className="relative flex aspect-video w-full flex-col items-center gap-2">
                  <iframe
                    src={prizeVideoUrls[lowercasePrize]}
                    allow="fullscreen; picture-in-picture"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    title="buildOn and GoodBids"
                  />
                </div>
                <p className="text-center text-lg font-bold text-bo-red">
                  <p className="text-sm font-normal text-outerSpace-700">
                    {prizeShortDescriptions[lowercasePrize]}
                  </p>
                  <p className="text-outerSpace-900">
                    value: {prizeValue[lowercasePrize]}
                  </p>
                </p>
              </Link>
            );
          })}
          <div
            className={`mt-4 flex aspect-video h-fit w-full flex-col items-center sm:mb-0 ${
              introVideoDimensions === "0px" ? "sm:w-fit" : "sm:w-1/2"
            }`}
          >
            <iframe
              src={goodBidsIntroVideo}
              allow="fullscreen; picture-in-picture; autoplay"
              className={introVideoDimensions === "0px" ? "hidden" : "visible"}
              style={{
                height: "100%",
                width: "100%",
              }}
              title="buildOn and GoodBids"
            />
            <p
              className=" cursor-pointer text-lg font-bold text-bo-red underline"
              onClick={() =>
                setIntroVideoDimensions((prior) =>
                  prior === "0px" ? "100%" : "0px"
                )
              }
            >
              Lean More about GoodBids
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
