import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { prizeVideoUrls } from "~/utils/constants";

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
  const shortSlug = {
    trek: "Help build a school in Senegal",
    watch: "The Apple Watch Ultra",
  };
  const prizeValue = { trek: "$45,000", watch: "$800" };
  return (
    <div className="flex h-full w-11/12 flex-col flex-nowrap items-center justify-center pb-10">
      {showHome && (
        <div className="flex h-full w-full flex-col flex-wrap justify-start gap-4 sm:h-full sm:flex-row sm:items-center sm:justify-center sm:gap-12 ">
          {prizes.map((prize) => {
            const lowercasePrize = prize.toLowerCase() as "trek" | "watch";
            return (
              <Link
                href={`/${lowercasePrize}`}
                className="container mt-4 flex h-2/5 w-full flex-col rounded sm:w-2/5 sm:justify-between sm:gap-6 sm:border sm:px-4 sm:py-8 sm:drop-shadow"
              >
                <p className="my-0 text-center text-2xl font-bold text-bo-red underline">
                  The {prize} Auction
                </p>
                <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
                  <iframe
                    src={prizeVideoUrls[lowercasePrize]}
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    title="buildOn and GoodBids"
                  />
                </div>
                <p className="text-center text-lg font-bold text-bo-red">
                  <p className="text-sm font-normal text-outerSpace-700">
                    {shortSlug[lowercasePrize]}
                  </p>
                  <p className="text-outerSpace-900">
                    {prizeValue[lowercasePrize]}
                  </p>
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
