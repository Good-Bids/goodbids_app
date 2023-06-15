import Image from "next/image";
import React, { useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);

  const isMobile = window && window.innerWidth <= 767;

  return (
    <div className="flex w-full flex-col items-center gap-2 md:w-2/3">
      {mainPhoto !== undefined && (
        <div className="relative mb-0 flex aspect-square w-screen overflow-hidden md:w-full">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            sizes="(max-width: 767px) 91.67%,
            (min-width: 768px) 33%"
            style={{ objectFit: "fill" }}
          />
        </div>
      )}
      {sources.length > 1 ? (
        <div className="flex h-1/6 w-full flex-row justify-center gap-1">
          {sources.map((imageSource) => (
            <div
              className={`relative h-[12px] w-[12px] rounded-md  
              ${imageSource === mainPhoto ? "bg-cw-blue" : "bg-outerSpace-200"} 
            md:aspect-square md:h-[unset] md:w-full md:overflow-hidden md:rounded-xl md:p-2`}
              key={imageSource}
              onMouseOver={() => {
                setMainPhoto(imageSource);
              }}
            >
              {!isMobile && (
                <Image
                  src={imageSource}
                  alt="a secondary image of the prize to be won"
                  priority={false}
                  fill
                  sizes="100%"
                  style={{ objectFit: "contain", cursor: "pointer" }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
