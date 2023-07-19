import { useEffect, useState } from "react";
import Image from "next/image";
import { prizeCopy } from "~/utils/constants";

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
    <div className="mx-2 my-4 flex w-full flex-col self-center sm:w-10/12">
      <div
        className="mx-4 flex h-[76px] max-w-full cursor-pointer flex-row items-center justify-between border-y"
        onClick={() => setShowItemDetails((prior) => !prior)}
      >
        <p className="text-l font-bold text-outerSpace-900">About this item</p>
        <svg width="24" height="25">
          <path
            d="M13.2673 4.95157C12.9674 4.66588 12.4926 4.67742 12.2069 4.97735C11.9213 5.27727 11.9328 5.75201 12.2327 6.0377L18.4841 11.9923H3.75C3.33579 11.9923 3 12.3281 3 12.7423C3 13.1565 3.33579 13.4923 3.75 13.4923H18.4842L12.2327 19.447C11.9328 19.7327 11.9213 20.2074 12.2069 20.5074C12.4926 20.8073 12.9674 20.8188 13.2673 20.5331L20.6862 13.4664C20.8551 13.3055 20.9551 13.1003 20.9861 12.8869C20.9952 12.8401 21 12.7918 21 12.7423C21 12.6927 20.9952 12.6443 20.986 12.5974C20.955 12.3842 20.855 12.1791 20.6862 12.0183L13.2673 4.95157Z"
            fill="#232826"
          />
        </svg>
      </div>
      <div
        className={`mx-4 my-2 ${
          showItemDetails ? "visible" : "hidden"
        } flex flex-col items-center justify-center`}
      >
        <div className={className}>
          <Image
            src={imgSrc}
            alt={imgAlt}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <p>{copy}</p>
      </div>
      <div
        className="mx-4 flex h-[76px] max-w-full cursor-pointer flex-row items-center justify-between border-y"
        onClick={() => setShowCharityDetails((prior) => !prior)}
      >
        <p className="text-l font-bold text-outerSpace-900">About buildOn</p>
        <svg width="24" height="25">
          <path
            d="M13.2673 4.95157C12.9674 4.66588 12.4926 4.67742 12.2069 4.97735C11.9213 5.27727 11.9328 5.75201 12.2327 6.0377L18.4841 11.9923H3.75C3.33579 11.9923 3 12.3281 3 12.7423C3 13.1565 3.33579 13.4923 3.75 13.4923H18.4842L12.2327 19.447C11.9328 19.7327 11.9213 20.2074 12.2069 20.5074C12.4926 20.8073 12.9674 20.8188 13.2673 20.5331L20.6862 13.4664C20.8551 13.3055 20.9551 13.1003 20.9861 12.8869C20.9952 12.8401 21 12.7918 21 12.7423C21 12.6927 20.9952 12.6443 20.986 12.5974C20.955 12.3842 20.855 12.1791 20.6862 12.0183L13.2673 4.95157Z"
            fill="#232826"
          />
        </svg>
      </div>
      <div
        className={`mx-4 my-2 ${
          showCharityDetails ? "visible" : "hidden"
        } flex flex-col gap-4`}
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
        <p>
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
        <p>
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
        <p>
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
        <p className="w-full">
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
        <p>
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
        <p>
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
