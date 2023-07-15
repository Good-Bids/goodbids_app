import Link from "next/link";

const Home = () => {
  return (
    <div className="flex h-full w-11/12 flex-col items-center justify-center gap-4">
      <p className="self-center text-4xl font-bold text-black">
        Welcome to GoodBids
      </p>
      <div className="flex h-fit w-full flex-col justify-center gap-16 md:h-full md:flex-row">
        <Link href="/trek-intro">
          <div
            className={`flex h-fit w-full justify-center rounded bg-bo-red p-8 md:w-fit md:p-32`}
          >
            <p className="text-2xl font-bold text-white">The Trek Auction</p>
          </div>
        </Link>
        <Link href="/watch-intro">
          <div
            className={`flex h-fit w-full justify-center rounded bg-bo-red p-8 md:w-fit md:p-32`}
          >
            <p className="text-2xl font-bold text-white">The Watch Auction</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
