import Image from "next/image";
import React, { useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);

  return (
    <div className="flex w-11/12 flex-col items-center gap-2 md:w-1/3">
      {mainPhoto !== undefined && (
        <div className="relative mb-0 flex aspect-square w-full overflow-hidden rounded-xl  bg-outerSpace-50">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            sizes="(max-width: 767px) 91.67%,
            (min-width: 768px) 33%"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      {sources.length > 1 ? (
        <div className="flex h-1/6 w-full flex-row justify-center gap-1 rounded-xl bg-outerSpace-50">
          {sources.map((imageSource) => (
            <div
              className="relative aspect-square w-1/6 overflow-hidden rounded-xl p-2"
              key={imageSource}
            >
              <Image
                src={imageSource}
                alt="a secondary image of the prize to be won"
                onMouseOver={() => {
                  setMainPhoto(imageSource);
                }}
                priority={false}
                fill
                sizes="100%"
                style={{ objectFit: "contain", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
