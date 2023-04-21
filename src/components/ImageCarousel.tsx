import Image from "next/image";
import React, { useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);

  return (
    <div className="flex aspect-square w-11/12 flex-col gap-2 md:w-2/3">
      {mainPhoto !== undefined && (
        <div className="relative mb-0 h-4/6 w-full overflow-hidden rounded-xl p-2">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      {sources.length > 1 ? (
        <div className="flex h-1/6 w-full flex-row justify-center gap-1">
          {sources.map((imageSource) => (
            <div
              className="relative aspect-square w-1/6 overflow-hidden rounded-md p-2"
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
                style={{ objectFit: "cover", cursor: "pointer" }}
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
