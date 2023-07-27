import Image from "next/image";
import React, { TouchEventHandler, useEffect, useState } from "react";

interface ImageCarouselProps {
  sources: string[];
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0]);
  const [lastTouchX, setLastTouchX] = useState<number>(400);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMobile = window && window.innerWidth <= 767;

  const handleTouch: TouchEventHandler<HTMLImageElement> = (e) => {
    if (e.type === "touchstart") {
      if (e.touches[0]) {
        const thisTouch = e.touches[0];
        setLastTouchX(thisTouch.screenX);
      }
    }
    if (e.type === "touchend") {
      if (e.changedTouches[0]) {
        const thisTouch = e.changedTouches[0];
        const { screenX } = thisTouch;
        if (screenX > lastTouchX) {
          setCurrentIndex((prior) =>
            prior > 0 ? prior - 1 : sources.length - 1
          );
        } else {
          setCurrentIndex((prior) =>
            prior < sources.length - 1 ? prior + 1 : 0
          );
        }
        setLastTouchX(window ? window.innerWidth / 2 : 400);
      }
    }
  };
  useEffect(() => {
    setMainPhoto(sources[currentIndex]);
  }, [currentIndex]);

  return (
    <div className="flex w-full flex-col items-center gap-2 sm:w-1/2">
      {mainPhoto !== undefined && (
        <div className="relative mb-0 flex aspect-square w-screen overflow-hidden sm:w-full sm:max-w-[400px] sm:rounded">
          <Image
            src={mainPhoto}
            alt="the primary image of the prize to be won"
            priority={true}
            fill
            sizes="(max-width: 767px) 91.67%,
            (min-width: 768px) 33%"
            style={{ objectFit: "fill" }}
            onTouchStart={handleTouch}
            onTouchEnd={handleTouch}
          />
        </div>
      )}
      {sources.length > 1 ? (
        <div className="flex h-fit w-full flex-row flex-wrap justify-center gap-1">
          {sources.map((imageSource, index) => (
            <div
              className={`relative aspect-square w-1/5 sm:h-[unset] sm:w-1/5 sm:overflow-hidden sm:rounded sm:p-2`}
              key={imageSource}
              onMouseOver={() => {
                setMainPhoto(sources[index]);
              }}
            >
              <Image
                src={imageSource}
                alt="a secondary image of the prize to be won"
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
