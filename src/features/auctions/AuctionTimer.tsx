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
    ? auction?.bids[auction?.bids.length - 1]
    : auction?.bids;

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const hoursLeft = Math.floor(timeLeft / 3600);
  const minutesLeft = Math.floor(timeLeft / 60 - hoursLeft * 60);
  const secondsLeft = timeLeft - hoursLeft * 3600 - minutesLeft * 60;
  const formatTime = (val: number) =>
    val < 10 ? "0" + Math.floor(val) : Math.floor(val);
  const formattedSecondsLeft = formatTime(secondsLeft);
  const formattedMinutesLeft = formatTime(minutesLeft);
  useInterval(() => {
    const lastBidTimestamp = new Date(Date.parse(lastBid?.created_at ?? ""));
    const expirationTime = (auction?.top_bid_duration ?? 0) * 1000;
    const expirationTimeStamp = lastBidTimestamp.setTime(
      lastBidTimestamp.getTime() + expirationTime
    );
    setTimeLeft((expirationTimeStamp - new Date().getTime()) / 1000);
    onTimeUpdate(auction?.status === "ACTIVE" && timeLeft > 0);
  }, 1000);

  const Background = ({ children }: { children: ReactNode }) =>
    hoursLeft >= 1 ? (
      <div className="w-fit rounded-full bg-screaminGreen bg-opacity-60 p-2">
        {children}
      </div>
    ) : (
      <div className="w-fit rounded-full bg-pompadour bg-opacity-60 p-2">
        {children}
      </div>
    );

  return (
    <Background>
      <p className="text-md text-left font-black text-neutral-800">
        {auctionIsActive
          ? `${hoursLeft}:${formattedMinutesLeft}:${formattedSecondsLeft} left before this auction ends`
          : "Auction Has Ended"}
      </p>
    </Background>
  );
};
