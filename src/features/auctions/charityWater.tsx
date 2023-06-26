import { useEffect, useState } from "react";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useMessageBus } from "~/contexts/Subscriptions";
import { PayPalDialog } from "~/features/auctions/PayPalDialog";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useIntroRedirect } from "~/hooks/useIntroRedirect";
import { useStorageItemsQuery } from "~/hooks/useStorage";
import { useUserQuery } from "~/hooks/useUser";
import { charityWaterAuctionId, fileStoragePath } from "~/utils/constants";
import { CommentContainer } from "../comments";
import { AuctionData } from "./AuctionData";
import { FreeBidDialog } from "./FreeBidDialog";

export const CharityWater = () => {
  const auctionId = charityWaterAuctionId;
  const { data: userData } = useUserQuery();
  const { data: auctionData } = useAuctionQuery(auctionId);
  const subscription = useMessageBus();
  const { data: auctionImages } = useStorageItemsQuery(auctionId);

  const [auctionIsActive, setAuctionIsActive] = useState(true);
  const [nextBidValue, setNextBidValue] = useState(0);
  const [displayAuction, setDisplayAuction] = useState(auctionData);

  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showCharityDetails, setShowCharityDetails] = useState(false);

  const [userId, setUserId] = useState<string>("unauthenticated");

  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auctionId}/${item.name}`
  );

  // no dependencies, only run this once
  useIntroRedirect();

  useEffect(() => {
    if (auctionData) {
      setDisplayAuction(auctionData);
      setNextBidValue(auctionData.high_bid_value + auctionData.increment);
    }
    if (!subscription.messageBus.isInitialized) return;
    // Listen for auction update messages
    if (subscription.messageBus.lastAuctionUpdateMessage) {
      const { auction: updatedAuction, eventType } =
        subscription.messageBus.lastAuctionUpdateMessage;
      if (updatedAuction.auction_id === auctionId) {
        if (eventType === "UPDATE") {
          setDisplayAuction(updatedAuction);
        }
      }
    }
  }, [
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastAuctionUpdateMessage,
    userData,
    auctionData,
  ]);

  useEffect(() => {
    if (userData) {
      setUserId(userData.id);
    }
  }, [userData]);

  return displayAuction ? (
    <div className="h-fit w-full pb-4">
      {imageUrls && <ImageCarousel sources={imageUrls} />}
      <AuctionData
        auctionId={auctionId}
        auction={displayAuction}
        userId={userId}
        setAuctionIsActive={setAuctionIsActive}
      />
      <PayPalDialog
        bidValue={nextBidValue}
        auction={displayAuction}
        isBidLocked={!auctionIsActive}
      />
      <FreeBidDialog
        bidValue={nextBidValue}
        auction={displayAuction}
        isBidLocked={!auctionIsActive}
      />
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
      <div className={`mx-4 my-2 ${showItemDetails ? "visible" : "hidden"}`}>
        <p>
          This may be the opportunity of a lifetime. You could be the lucky
          bidder and win a private dinner with Sir Paul McCartney at an
          exclusive restaurant in New York City, as well as a signed bass
          guitar! The love you take is equal to the love you make. All donations
          go directly to charity:water.
        </p>
        <p>
          Win or lose, your donation makes a difference. Each donation received
          in this positive auction is also a bid to win dinner with Sir Paul.
          The experience of dining with Sir Paul McCartney is a dream come true
          for any music lover. You'll have the chance to enjoy a gourmet meal
          while chatting with one of the most influential musicians of our time.
          Imagine discussing the Beatles' early days, their rise to fame, and
          the inspiration behind some of their greatest hits. Sir Paul McCartney
          is an engaging and fascinating conversationalist, and this is a
          once-in-a-lifetime opportunity to get to know him on a personal level.
          You can bring a camera for selfies, of course. The winner of this
          auction will also receive a signed bass guitar from Sir Paul McCartney
          himself.
        </p>
        <p>
          Imagine owning a piece of music history and displaying it in your
          home. The bass guitar will come with a certificate of authenticity,
          ensuring that it is a genuine item signed by the legend himself. Not
          only will you have the experience of a lifetime, but you'll also be
          contributing to a worthy cause. Every bid is a donation directly to
          charity:water. Win or lose, you can feel good knowing that your
          winning bid will make a real difference to thousands of people who
          struggle every day. There is no reserve. The last bidder wins the
          prize package. Every other bid is fully tax-deductible donation.
        </p>
        <p>
          Winner is responsible for any taxes as well as transportation to the
          event. This is your chance to be part of music history and create
          memories that will last a lifetime. Don't miss out on the opportunity
          to dine with Sir Paul McCartney and own a signed bass guitar. Bid now
          and support a worthy cause at the same time.
        </p>
      </div>
      <div
        className="mx-4 flex h-[76px] max-w-full cursor-pointer flex-row items-center justify-between border-y"
        onClick={() => setShowCharityDetails((prior) => !prior)}
      >
        <p className="text-l font-bold text-outerSpace-900">
          About Charity:Water
        </p>
        <svg width="24" height="25">
          <path
            d="M13.2673 4.95157C12.9674 4.66588 12.4926 4.67742 12.2069 4.97735C11.9213 5.27727 11.9328 5.75201 12.2327 6.0377L18.4841 11.9923H3.75C3.33579 11.9923 3 12.3281 3 12.7423C3 13.1565 3.33579 13.4923 3.75 13.4923H18.4842L12.2327 19.447C11.9328 19.7327 11.9213 20.2074 12.2069 20.5074C12.4926 20.8073 12.9674 20.8188 13.2673 20.5331L20.6862 13.4664C20.8551 13.3055 20.9551 13.1003 20.9861 12.8869C20.9952 12.8401 21 12.7918 21 12.7423C21 12.6927 20.9952 12.6443 20.986 12.5974C20.955 12.3842 20.855 12.1791 20.6862 12.0183L13.2673 4.95157Z"
            fill="#232826"
          />
        </svg>
      </div>
      <div className={`mx-4 my-2 ${showCharityDetails ? "visible" : "hidden"}`}>
        <iframe
          className="aspect-video w-full"
          src="https://www.youtube.com/embed/gP6p7_Sd3MU"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <p>
          charity: water is a nonprofit organization bringing clean and safe
          water to people around the world. Together, we can end the water
          crisis 771 million people in the world live without clean water.
          That’s nearly 1 in 10 people worldwide. Or, twice the population of
          the United States.
        </p>
        <p>
          The majority live in isolated rural areas and spend hours every day
          walking to collect water for their family. Not only does walking for
          water keep children out of school or take up time that parents could
          be using to earn money, but the water often carries diseases that can
          make everyone sick. But access to clean water means education, income
          and health - especially for women and kids. Since charity: water was
          founded in 2006, we’ve been chasing one ambitious goal: ending the
          global water crisis. And while the water crisis is huge, we’re
          optimistic. We know how to solve the problem, and we make progress
          every day thanks to the help of local partners and generous
          supporters. If we work together, we believe everyone will have access
          to life’s most basic need within our lifetime. We’ve already helped
          16,000,000 people get access to clean water, but there’s a lot more
          work to do. 100% of the donations we receive go directly to fund water
          projects.
        </p>
      </div>
      <CommentContainer auctionId={auctionId} />
    </div>
  ) : (
    <></>
  );
};
