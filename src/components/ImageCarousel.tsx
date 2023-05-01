import Image from "next/image";
import React, { useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);

  return (
    <div className="flex w-11/12 flex-col gap-2 md:w-2/3 items-center">
      {mainPhoto !== undefined && (
        <div className="flex aspect-square relative mb-0 h-full w-4/6 overflow-hidden rounded-xl">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      {sources.length > 1 ? (
        <div className="flex h-1/6 w-full flex-row justify-center gap-1">
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
