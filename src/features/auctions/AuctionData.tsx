import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuctionPresence, useBidsByAuction } from "~/hooks/useAuction";
import { useAuctionTimer } from "~/hooks/useAuctionTimer";
import { useItemQuery } from "~/hooks/useItem";
import { Auction } from "~/utils/types/auctions";

interface AuctionDataProps {
  auctionId: string;
  userId: string;
  auction: Auction;
  setAuctionIsActive: Dispatch<SetStateAction<boolean>>;
}

export const AuctionData = ({
  auction,
  auctionId,
  setAuctionIsActive,
  userId,
}: AuctionDataProps) => {
  const { data: bidsData } = useBidsByAuction(auctionId);
  const { data: itemData } = useItemQuery(auction.item_id ?? "");
  const [auctionStats, setAuctionStats] = useState<{
    bidCount: number;
    totalRaised: number;
    totalParticipants: number;
    myContribution: number;
  }>({ bidCount: 0, totalRaised: 0, totalParticipants: 0, myContribution: 0 });

  useEffect(() => {
    if (bidsData) {
      setAuctionStats({
        bidCount: bidsData?.length ?? 0,
        totalRaised:
          bidsData?.reduce((acc, curr) => acc + curr.bid_value, 0) ?? 0,
        totalParticipants:
          bidsData
            ?.map((bid) => bid.bidder_id)
            .filter((v, i, s) => s.indexOf(v) === i).length ?? 0,
        myContribution:
          bidsData
            ?.filter((bid) => bid.bidder_id === userId)
            ?.reduce((acc, curr) => acc + curr.bid_value, 0) ?? 0,
      });
    }
  }, [bidsData]);

  const attendance = useAuctionPresence(auctionId, userId);
  const attendanceString = () => {
    const otherCount = attendance.length - 1;
    if (otherCount == 0) {
      return `You're the only one here. Now's your chance!`;
    } else
      return `${otherCount} other ${
        otherCount == 1 ? "person is" : "people are"
      } looking at this auction right now.`;
  };

  const { string: timeLeft } = useAuctionTimer({
    auction,
    onTimeUpdate: (arg0: boolean) => {
      setAuctionIsActive((prior: boolean) => {
        return prior !== arg0 ? arg0 : prior;
      });
    },
    interval: 500,
  });

  return (
    <div className="mx-4 h-fit flex-col gap-6">
      <p className="text-2xl font-bold">{auction.name}</p>
      <div
        className="flex border-collapse flex-row justify-start gap-2 border-y border-y-outerSpace-100 py-3"
        role="time left"
      >
        <svg width="24" height="24">
          <path
            d="M15.25 13.5H11.25C10.836 13.5 10.5 13.164 10.5 12.75V6.75C10.5 6.336 10.836 6 11.25 6C11.664 6 12 6.336 12 6.75V12H15.25C15.664 12 16 12.336 16 12.75C16 13.164 15.664 13.5 15.25 13.5ZM12 2C6.478 2 2 6.478 2 12C2 17.522 6.478 22 12 22C17.522 22 22 17.522 22 12C22 6.478 17.522 2 12 2Z"
            fill="rgb(220 38 38)"
          />
        </svg>
        <span>
          {`Ending in `}
          <span className="font-bold text-red-600">{timeLeft}</span>
          {` if nobody else bids`}
        </span>
      </div>
      <div
        className="flex w-full border-collapse flex-row justify-start gap-2 border-b border-y-outerSpace-100 py-3"
        role="attendance count"
      >
        <svg width="24" height="24">
          <path
            d="M6.15636 9.3231L6.15395 9.32491L6.15 9.3279L6.13963 9.33586C6.13164 9.34204 6.12151 9.34999 6.10942 9.35973C6.08524 9.37919 6.05314 9.40581 6.01442 9.43966C5.93703 9.50732 5.83284 9.6042 5.71236 9.73104C5.47171 9.98437 5.16368 10.3598 4.8751 10.8629C4.29291 11.8779 3.80368 13.3906 4.07868 15.4142C4.34997 17.4107 5.18833 19.0801 6.60711 20.244C8.02084 21.4038 9.93533 22 12.25 22C14.6375 22 16.5425 21.1054 17.8042 19.5699C19.0544 18.0486 19.6122 15.9741 19.4787 13.706C19.3508 11.5302 18.1656 9.87945 17.1188 8.42123C17.0177 8.28043 16.9179 8.14142 16.8205 8.00391C15.6785 6.39222 14.7768 4.90657 14.9959 2.82863C15.0182 2.61721 14.9497 2.40625 14.8075 2.24824C14.6652 2.09023 14.4626 2 14.25 2C13.868 2 13.4309 2.11822 13.0077 2.29599C12.5715 2.47923 12.0984 2.74751 11.6351 3.09694C10.7104 3.79438 9.78589 4.84563 9.29236 6.25159C8.80006 7.65408 9.04947 8.99089 9.41008 9.9632C9.64689 10.6017 9.39005 11.233 9.00347 11.4165C8.66159 11.5789 8.25252 11.4427 8.07619 11.1078L7.26887 9.57452C7.16673 9.38052 6.98481 9.24093 6.77099 9.19248C6.55717 9.14403 6.33215 9.19209 6.15636 9.3231Z"
            fill="#212121"
          />
        </svg>

        {attendanceString()}
      </div>
      <div className="flex w-full flex-row justify-between py-3">
        <div className="w-1/4">
          <span>
            {`Est value: `}
            <span className="text-sm font-bold">
              ${itemData?.value?.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="border-r border-solid border-outerSpace-100" />
        <div className="w-1/4">
          <span>
            {`Raised: `}
            <span className="text-sm font-bold">
              ${auctionStats.totalRaised.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="border-l border-solid border-outerSpace-100" />
        <div className="w-1/4">
          <span>
            {`Your total: `}
            <span className="text-sm font-bold">
              ${auctionStats.myContribution.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
