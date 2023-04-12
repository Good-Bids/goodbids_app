import Image from "next/image"
import { useState } from "react"

type ImageCarouselProps = {
  sources: string[]
}

export const ImageCarousel = ({ sources }: ImageCarouselProps) => {
  const [mainPhoto, setMainPhoto] = useState(sources[0])

  return (
    <div className="w-full h-80 flex flex-col lg:w-2/3 gap-2">
      {mainPhoto && (
        <div className="overflow-hidden h-4/5 p-2 relative rounded-xl w-full">
          <Image src={mainPhoto} alt='the primary image of the prize to be won' className="w-full h-4/5" priority={true} fill style={{ objectFit: 'cover' }} />
        </div>)
      }
      <div className="w-full h-1/5 flex flex-row justify-center gap-1">
        {sources.map((imageSource) => (
          <div className="overflow-hidden p-2 relative rounded-md w-1/12">
            <Image src={imageSource} alt='a secondary image of the prize to be won' onClick={() => setMainPhoto(imageSource)} priority={false} fill style={{ objectFit: 'cover', cursor: 'pointer' }} />
          </div>
        ))}
      </div>
    </div>
  )
}