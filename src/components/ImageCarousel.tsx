import Image from "next/image";
import React, { useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);

  return (
    <div className="lg: flex aspect-square w-11/12 flex-col gap-2">
      {mainPhoto !== undefined && (
        <div className="relative h-4/5 w-full overflow-hidden rounded-xl p-2">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="flex h-1/5 w-full flex-row justify-center gap-1">
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
    </div>
  );
};
