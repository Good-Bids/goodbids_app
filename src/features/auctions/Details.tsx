import { useEffect, useState } from "react";
import Image from "next/image";
import { prizeCopy, prizeVideoUrls } from "~/utils/constants";
import { PlusIcon, MinusIcon } from "lucide-react";

export const Details = (props: {
  charity: "buildOn" | "charityWater";
  prize: "watch" | "trek";
}) => {
  const { charity, prize } = props;
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showCharityDetails, setShowCharityDetails] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth > 640) {
      setShowCharityDetails(true);
      setShowItemDetails(true);
    }
  }, []);

  const { imgSrc, imgAlt, copy, className } = prizeCopy[prize];

  return (
    <div className="mx-2 mb-20 mt-2 flex w-full flex-col self-center sm:mb-2 sm:w-10/12 sm:max-w-[500px]">
      <div
        className="mx-4 flex h-[76px] max-w-full cursor-pointer flex-row items-center justify-between border-y pr-20"
        onClick={() => setShowItemDetails((prior) => !prior)}
      >
        <p className="text-l font-bold text-outerSpace-900 sm:ml-8">
          About this item
        </p>
        {showItemDetails ? <MinusIcon /> : <PlusIcon />}
      </div>
      <div
        className={`mx-4 my-2 ${
          showItemDetails ? "visible" : "hidden"
        } flex flex-col items-center justify-center`}
      >
        {copy}
        <div className=" relative flex aspect-video w-full flex-col items-center gap-2">
          <iframe
            src={prizeVideoUrls[prize]}
            allow="autoplay; fullscreen; picture-in-picture"
            style={{
              width: "100%",
              height: "100%",
            }}
            title="buildOn and GoodBids"
          />
        </div>
      </div>
      <div
        className="mx-4 flex h-[76px] max-w-full cursor-pointer flex-row items-center justify-between border-y pr-20"
        onClick={() => setShowCharityDetails((prior) => !prior)}
      >
        <p className="text-l font-bold text-outerSpace-900 sm:ml-8">
          About buildOn
        </p>
        {showCharityDetails ? <MinusIcon /> : <PlusIcon />}
      </div>
      <div
        className={`mx-4 my-2 ${
          showCharityDetails ? "visible" : "hidden"
        } mb flex flex-col gap-4`}
      >
        {/* prompt: Can you write 250 words about buildOn and why it's a wonderful charity to support */}
        <div className="relative flex aspect-[1.6155115511551] w-full">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOn_senegal-1.webp"
            alt="a student smiles at the camera"
          />
        </div>
        <p className="my-2 w-full">
          buildOn is a remarkable charity that stands out for its transformative
          impact on communities around the world. With a mission to break the
          cycle of poverty, illiteracy, and low expectations, buildOn empowers
          individuals by providing access to education and promoting social
          change through service.
        </p>
        <div className="relative flex aspect-[1.6155115511551] w-full self-end">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOn_senegal-2.webp"
            alt="members of the community line up to sign the covenant"
          />
        </div>
        <p className="my-2 w-full">
          By constructing schools in some of the most underserved regions of the
          world, buildOn opens doors to learning for children and adults who
          previously had limited or no access to education. Education is the
          foundation for personal growth, empowerment, and economic
          opportunities, and buildOn recognizes this crucial link.
        </p>
        <div className="relative flex aspect-[1.6155115511551] w-full self-start">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOn_senegal-3.webp"
            alt="a buildOn member sharing a moment with a student"
          />
        </div>
        <p className="my-2 w-full">
          But buildOn goes beyond simply constructing schools. It engages local
          communities, encouraging active participation and ownership in the
          process. Members of the community contribute volunteer hours to build
          their own schools, fostering a sense of pride, ownership, and
          investment in education. This participatory approach ensures
          sustainability and long-term impact.
        </p>
        <div className="relative flex aspect-[1.6155115511551] w-full self-end">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOn_senegal-4.webp"
            alt="adult students in class"
          />
        </div>
        <p className="my-2 w-full">
          Through its Service Learning Programs, buildOn engages students from
          underserved schools in the United States in community service
          activities. These experiences help young people develop empathy,
          compassion, and a sense of responsibility towards others. By actively
          engaging students in service, buildOn instills values that transcend
          borders, fostering a generation of socially conscious individuals.
        </p>
        <div className="relative flex aspect-[1.6155115511551] w-full">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOn_senegal-5.webp"
            alt="a buildOn member sharing a moment with a student"
          />
        </div>
        <p className="my-2 w-full">
          buildOn's programs have a ripple effect. As education improves and
          communities become more empowered, the positive impact extends beyond
          the school walls. These empowered communities take charge of their own
          development, driving sustainable change and breaking the cycle of
          poverty for future generations.
        </p>
        <div className="relative flex aspect-[1.6155115511551] w-1/2">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src="/buildOnLogo.png"
            alt="the buildOn logo"
          />
        </div>
        <p className="my-2 mb-8 w-full">
          buildOn not only constructs schools but also builds futures. Its
          commitment to education, community involvement, and global citizenship
          make it a wonderful organization to support. By empowering
          individuals, transforming communities, and promoting service, buildOn
          is creating a brighter, more equitable future for all.
        </p>
      </div>
    </div>
  );
};
