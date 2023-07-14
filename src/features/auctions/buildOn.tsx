import { useEffect, useState } from "react";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useMessageBus } from "~/contexts/Subscriptions";
import { PayPalDialog } from "~/features/auctions/PayPalDialog";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useIntroRedirect } from "~/hooks/useIntroRedirect";
import { useStorageItemsQuery } from "~/hooks/useStorage";
import { useUserQuery } from "~/hooks/useUser";
import { buildOnAuctionIds, fileStoragePath } from "~/utils/constants";
import { CommentContainer } from "../comments";
import { AuctionData } from "./AuctionData";
import { Details } from "./Details";
import { FreeBidDialog } from "./FreeBidDialog";

export const BuildOn = (props: { prize: "trek" | "watch" }) => {
  const auctionId = buildOnAuctionIds[props.prize];
  const { data: userData } = useUserQuery();
  const { data: auctionData } = useAuctionQuery(auctionId);
  const subscription = useMessageBus();
  const { data: auctionImages } = useStorageItemsQuery(auctionId);

  const [auctionIsActive, setAuctionIsActive] = useState(true);
  const [nextBidValue, setNextBidValue] = useState(0);
  const [displayAuction, setDisplayAuction] = useState(auctionData);

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
          setNextBidValue(
            updatedAuction.high_bid_value + updatedAuction.increment
          );
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
    <div className="flex h-fit w-full flex-col pb-4 md:h-full md:w-full md:flex-row md:overflow-y-clip">
      <div className="flex flex-col overflow-y-scroll md:mr-8 md:h-full md:w-4/5">
        <div className="flex flex-col md:h-fit md:flex-row md:gap-8">
          {imageUrls && <ImageCarousel sources={imageUrls} />}
          <div className="flex flex-col">
            <AuctionData
              auctionId={auctionId}
              auction={displayAuction}
              userId={userId}
              setAuctionIsActive={setAuctionIsActive}
              charity="buildOn"
            />
            <div className="my-4 flex flex-col gap-4 py-4">
              <PayPalDialog
                bidValue={nextBidValue}
                auction={displayAuction}
                isBidLocked={!auctionIsActive}
                charity="buildOn"
              />
              <FreeBidDialog
                bidValue={nextBidValue}
                auction={displayAuction}
                isBidLocked={!auctionIsActive}
                charity="buildOn"
              />
            </div>
          </div>
        </div>
        <Details charity="buildOn" />
      </div>
      <CommentContainer auctionId={auctionId} charity="buildOn" />
    </div>
  ) : (
    <></>
  );
};
