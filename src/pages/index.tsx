import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex h-full w-11/12 flex-col items-center justify-center gap-4">
      <div className="flex h-full w-full flex-col flex-wrap justify-center gap-16 sm:h-full sm:flex-row">
        <Link href="/trek" className="h-fit w-full sm:w-2/5">
          <p className="text-center text-xl font-bold text-bo-red">
            The Trek Auction
          </p>
          <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
            <Image
              src="/buildOn_senegal-2.webp"
              alt="a buildOn trek member shares a moment with a student"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
        <Link href="/watch" className="h-fit w-full sm:w-2/5">
          <p className="text-center text-xl font-bold text-bo-red">
            The Watch Auction
          </p>
          <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
            <Image
              src="/watch_hero.jpg"
              fill
              style={{ objectFit: "contain" }}
              alt="an image of the apple watch ultra"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
