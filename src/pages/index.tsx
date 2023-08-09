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
    <div className="flex h-full w-11/12 flex-col flex-nowrap items-center justify-center pb-10">
      {showHome && (
        <div className="align-center flex h-fit w-full flex-col flex-nowrap justify-start gap-4 overflow-y-auto sm:h-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-12">
          {prizes.map((prize) => {
            const lowercasePrize = prize.toLowerCase() as "trek" | "watch";
            return (
              <Link
                href={`/${lowercasePrize}`}
                className="container mt-4 flex h-2/5 w-full flex-col rounded sm:h-1/2 sm:w-2/5 sm:justify-between sm:gap-6 sm:border sm:px-4 sm:py-8 sm:drop-shadow"
              >
                <p className="my-0 text-center text-2xl font-bold text-bo-red underline">
                  The {prize} Auction
                </p>
                <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
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
          <div className="mb-24 mt-4 flex aspect-video h-fit w-full flex-col items-center sm:mb-0 sm:h-2/5 sm:w-1/2">
            <p className=" text-2xl font-bold text-bo-red">What is GoodBids?</p>
            <iframe
              src={goodBidsIntroVideo}
              allow="fullscreen; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
              }}
              title="buildOn and GoodBids"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
