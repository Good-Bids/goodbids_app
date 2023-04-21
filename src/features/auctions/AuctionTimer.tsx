import { time } from "console";
import { ReactNode, useState } from "react";
import { useInterval } from "usehooks-ts";
import { AuctionExtended } from "~/utils/types/auctions";

interface AuctionTimerProps {
  auction: AuctionExtended;
  auctionIsActive: boolean;
  onTimeUpdate: (arg0: boolean) => void;
}

export const AuctionTimer = ({
  auction,
  onTimeUpdate,
  auctionIsActive,
}: AuctionTimerProps) => {
  const lastBid = Array.isArray(auction?.bids)
    ? auction?.bids[0]
    : auction?.bids;

  const [timeLeft, setTimeLeft] = useState<number>();
  useInterval(() => {
    const lastBidTimestamp = new Date(Date.parse(lastBid?.created_at ?? ""));
    const expirationTime = (auction?.top_bid_duration ?? 0) * 1000;
    const expirationTimeStamp = lastBidTimestamp.setTime(
      lastBidTimestamp.getTime() + expirationTime
    );
    setTimeLeft((expirationTimeStamp - new Date().getTime()) / 1000);
    onTimeUpdate(auction?.status === "ACTIVE" && (timeLeft ?? 0) > 0);
  }, 1000);

  if (timeLeft !== undefined) {
    const hoursLeft = Math.floor(timeLeft / 3600);
    const minutesLeft = Math.floor(timeLeft / 60 - hoursLeft * 60);
    const secondsLeft = timeLeft - hoursLeft * 3600 - minutesLeft * 60;
    const formatTime = (val: number) =>
      val < 10 ? "0" + Math.floor(val) : Math.floor(val);
    const formattedSecondsLeft = formatTime(secondsLeft);
    const formattedMinutesLeft = formatTime(minutesLeft);

    return hoursLeft >= 1 ? (
      <div className="w-fit self-center rounded-full bg-screaminGreen bg-opacity-60 px-4 py-1">
        <p className="text-md text-center font-black text-neutral-800">
          {`${hoursLeft}:${formattedMinutesLeft}:${formattedSecondsLeft} left
          before this auction ends`}
        </p>
      </div>
    ) : (
      <div className="w-fit self-center rounded-full bg-cornflowerLilac bg-opacity-100 px-4 py-1">
        <p className="text-md text-center font-black text-pompadour">
          {auctionIsActive
            ? `${hoursLeft}:${formattedMinutesLeft}:${formattedSecondsLeft} left before this auction ends`
            : "Auction Has Ended"}
        </p>
      </div>
    );
  } else return <></>;
};
