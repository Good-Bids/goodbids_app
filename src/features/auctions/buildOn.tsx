import { useEffect, useState } from "react";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useMessageBus } from "~/contexts/Subscriptions";
import { PayPalDialog } from "~/features/auctions/PayPalDialog";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useStorageItemsQuery } from "~/hooks/useStorage";
import { useUserQuery } from "~/hooks/useUser";
import { buildOnAuctionIds, fileStoragePath } from "~/utils/constants";
import { CommentContainer } from "../comments";
import { AuctionData } from "./AuctionData";
import { Details } from "./Details";
import { FreeBidDialog } from "./FreeBidDialog";
import { IntroDialog } from "./IntroDialog";

export const BuildOn = (props: { prize: "trek" | "watch" }) => {
  const { prize } = props;
  const auctionId = buildOnAuctionIds[prize];
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
    <div className="flex h-fit w-full flex-col pb-4 sm:h-full sm:w-full sm:flex-row sm:overflow-y-clip sm:pb-0">
      <div className="flex w-full flex-col overflow-y-auto sm:mr-8 sm:h-full sm:w-4/5 sm:pt-20">
        <div className="flex w-full flex-col sm:h-fit sm:flex-row sm:gap-2">
          {imageUrls && <ImageCarousel sources={imageUrls} />}
          <div className="flex w-full flex-col sm:w-1/2">
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
              <IntroDialog prize={prize} />
            </div>
          </div>
        </div>
        <Details charity="buildOn" prize={prize} />
      </div>
      <CommentContainer auctionId={auctionId} charity="buildOn" />
    </div>
  ) : (
    <></>
  );
};
