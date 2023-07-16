import Link from "next/link";
import { useAuctionRedirect } from "~/hooks/useAuctionRedirect";

const Home = () => {
  useAuctionRedirect();

  return (
    <div className="flex h-full w-11/12 flex-col items-center justify-center gap-4">
      <p className="self-center text-4xl font-bold text-black">
        Welcome to GoodBids
      </p>
      <div className="flex h-fit w-full flex-col flex-wrap justify-center gap-16 md:h-full md:flex-row">
        <Link href="/trek-intro" className="h-fit">
          <div
            className={`mx-6 flex h-fit w-full justify-center rounded bg-bo-red p-8 md:h-fit md:w-fit`}
          >
            <p className="text-2xl font-bold text-white">The Trek Auction</p>
          </div>
        </Link>
        <Link href="/watch-intro" className="h-fit">
          <div
            className={`mx-6 flex h-fit w-full justify-center rounded bg-bo-red p-8 md:h-fit md:w-fit`}
          >
            <p className="text-2xl font-bold text-white">The Watch Auction</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
