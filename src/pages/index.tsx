import Image from "next/image";
import Link from "next/link";
import { prizeVideoUrls } from "~/utils/constants";

const Home = () => {
  return (
    <div className="flex h-full w-11/12 flex-col flex-nowrap items-center justify-center pb-10 pt-10">
      <div className="flex h-full w-full flex-col flex-wrap justify-center gap-4 sm:h-full sm:flex-row sm:items-center sm:gap-12">
        <Link href="/trek" className="h-fit w-full sm:w-2/5">
          <p className="text-center text-xl font-bold text-bo-red">
            The Trek Auction
          </p>
          <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
            <iframe
              src={prizeVideoUrls.trek}
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
              }}
              title="buildOn and GoodBids"
            />
          </div>
        </Link>
        <Link href="/watch" className="h-fit w-full sm:w-2/5">
          <p className="text-center text-xl font-bold text-bo-red">
            The Watch Auction
          </p>
          <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
            <iframe
              src={prizeVideoUrls.watch}
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
              }}
              title="buildOn and GoodBids"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
