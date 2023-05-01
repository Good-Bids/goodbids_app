import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { Auction } from "~/utils/types/auctions";

interface AuctionTimerArgs {
  auction?: Auction;
  onTimeUpdate: (arg0: boolean) => void;
  interval?: number;
}

export const useAuctionTimer = (args: AuctionTimerArgs) => {
  const { auction, onTimeUpdate, interval = 100 } = args;

  const [timeLeft, setTimeLeft] = useState<number>(0);
  useInterval(() => {
    const lastBidTimestamp = new Date(
      Date.parse(auction?.latest_bid_timestamptz ?? new Date().toDateString())
    );
    const expirationTime = (auction?.top_bid_duration ?? 0) * 1000;
    const expirationTimeStamp = lastBidTimestamp.setTime(
      lastBidTimestamp.getTime() + expirationTime
    );
    setTimeLeft((expirationTimeStamp - new Date().getTime()) / 1000);
    onTimeUpdate(auction?.status === "ACTIVE" && (timeLeft ?? 0) > 0);
  }, interval);

  if (timeLeft !== undefined) {
    const hoursLeft = Math.floor(timeLeft / 3600);
    const minutesLeft = Math.floor(timeLeft / 60 - hoursLeft * 60);
    const secondsLeft = timeLeft - hoursLeft * 3600 - minutesLeft * 60;
    const formatTime = (val: number) =>
      val < 10 ? "0" + Math.floor(val) : Math.floor(val);

    const formattedSecondsLeft = formatTime(secondsLeft);
    const formattedMinutesLeft = formatTime(minutesLeft);

    return {
      string:
        hoursLeft + ":" + formattedMinutesLeft + ":" + formattedSecondsLeft,
      values: {
        hoursLeft,
        minutesLeft,
        secondsLeft,
      },
    };
  } else
    return {
      string: "undefined",
      values: { hoursLeft: 0, minutesLeft: 0, secondsLeft: 0 },
    };
};
