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
    lastBidValue: number;
  }>({
    bidCount: 0,
    totalRaised: 0,
    totalParticipants: 0,
    myContribution: 0,
    lastBidValue: 0,
  });

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
        lastBidValue: auction.high_bid_value ?? 0,
      });
    }
  }, [bidsData]);

  const freeBidsPrompt =
    bidsData && bidsData?.length < 10
      ? "First 10 Bids earn a Free Bid"
      : "Invite two Friends, and if they bid you earn a Free Bid!";

  const rightHandData =
    auctionStats.myContribution == 0
      ? {
          text: "Last Bid: ",
          value: `${auctionStats.lastBidValue.toLocaleString()}`,
        }
      : {
          text: "Your Total: ",
          value: auctionStats.myContribution.toLocaleString(),
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
    <div className="mx-4 h-fit flex-col gap-6 md:w-fit">
      <p className="text-2xl font-bold md:text-3xl">{auction.name}</p>
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
        role="freebidsPrompt"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6339 2.32234C18.8701 1.98207 19.3375 1.89769 19.6777 2.13389C20.486 2.69491 21.1561 3.67754 21.5758 4.76063C21.9997 5.85476 22.2051 7.14478 21.9888 8.37941C21.9174 8.78741 21.5287 9.06023 21.1207 8.98876C20.7127 8.91729 20.4398 8.5286 20.5113 8.1206C20.6712 7.20786 20.5236 6.19702 20.1771 5.30257C19.8262 4.39708 19.3083 3.7034 18.8224 3.36612C18.4821 3.12993 18.3978 2.66261 18.6339 2.32234ZM9.58827 2.8729C9.10915 2.19228 8.2447 1.85188 7.40145 2.07002C6.48983 2.30584 5.88778 3.11587 5.86678 4.00334C5.73125 4.0024 5.59384 4.01518 5.45628 4.04269C4.26933 4.28008 3.55794 5.50286 3.93823 6.65204L5.89771 12.5734C5.21884 12.5289 4.62523 12.6079 4.10964 12.773C3.29216 13.0347 2.72294 13.4962 2.3461 13.9267C1.97164 14.3545 1.91357 14.8913 2.07488 15.3469C2.22821 15.7799 2.56904 16.1272 2.98597 16.3164C4.40097 16.9587 7.26049 18.4347 9.7378 20.8037C10.7629 21.7839 12.2595 22.2767 13.7005 21.8454L16.2885 21.0709C17.2782 20.7747 18.0365 19.9406 18.1805 18.888C18.3243 17.837 18.5008 16.2465 18.5008 14.75C18.5008 12.9863 18.0439 11.0416 17.4997 9.33952C16.9523 7.62763 16.2998 6.11084 15.8746 5.18862C15.4683 4.30718 14.5164 3.86303 13.5976 4.04679C13.3088 4.10454 13.0468 4.21804 12.8198 4.37338L12.6646 3.88732C12.3548 2.91714 11.3654 2.33465 10.3668 2.53438C10.0752 2.5927 9.81261 2.71086 9.58827 2.8729ZM8.43158 3.87372L8.83647 5.04853C8.84611 5.08192 8.85666 5.11526 8.86815 5.14853L10.5407 9.99469C10.6759 10.3862 11.1028 10.5941 11.4944 10.459C11.5733 10.4317 11.6447 10.3927 11.7074 10.3444L11.7233 10.3318C11.9606 10.1388 12.0645 9.81132 11.9591 9.50538L10.2716 4.60908C10.2081 4.33772 10.381 4.06125 10.6609 4.00525C10.9107 3.95529 11.1582 4.101 11.2357 4.34368L11.9598 6.6108C11.972 6.66126 11.9862 6.71169 12.0024 6.76199L12.8715 9.46537L13.0352 9.97818C13.1363 10.2946 13.4277 10.4972 13.7426 10.5002C13.8212 10.501 13.9013 10.4894 13.9803 10.464C14.3747 10.3373 14.5916 9.91481 14.4648 9.52047L14.2999 9.00772L13.4103 6.22212C13.3531 5.9009 13.562 5.58361 13.8917 5.51766C14.1631 5.46339 14.4106 5.59579 14.5124 5.81662C14.9224 6.7058 15.5485 8.16252 16.0709 9.79638C16.5965 11.4401 17.0008 13.2134 17.0008 14.75C17.0008 16.1465 16.8347 17.6592 16.6944 18.6847C16.634 19.1258 16.313 19.4978 15.8584 19.6339L13.2705 20.4084C12.4258 20.6612 11.4737 20.3882 10.7745 19.7196C8.12423 17.1852 5.09387 15.626 3.60597 14.9506C3.56911 14.9338 3.53989 14.9119 3.5192 14.8901C3.51497 14.8856 3.51128 14.8814 3.50808 14.8774C3.7402 14.6228 4.07971 14.3575 4.56703 14.2015C5.0765 14.0384 5.79992 13.9778 6.81076 14.2398C7.07658 14.3086 7.35879 14.2267 7.54645 14.0263C7.7341 13.8258 7.7972 13.5388 7.71093 13.2781L5.36228 6.18079C5.26504 5.88694 5.44694 5.57427 5.75045 5.51356C6.00569 5.46252 6.25893 5.60982 6.34074 5.85692L7.77949 10.2026L8.03745 10.9879C8.16671 11.3815 8.59051 11.5957 8.98404 11.4665C9.25125 11.3787 9.4358 11.1551 9.48627 10.8974C9.51115 10.7739 9.5052 10.6425 9.46277 10.5143L9.20403 9.73279L7.39424 4.22282C7.29561 3.92254 7.47112 3.60137 7.77712 3.52221C8.05357 3.4507 8.33854 3.60375 8.43158 3.87372ZM18.2987 4.23867C18.0163 3.93565 17.5417 3.91893 17.2387 4.20133C16.9356 4.48374 16.9189 4.95831 17.2013 5.26134C17.6189 5.70944 18 6.251 18 7.25C18 7.66422 18.3358 8 18.75 8C19.1642 8 19.5 7.66422 19.5 7.25C19.5 5.749 18.8773 4.85959 18.2987 4.23867Z"
            fill="#003366"
          />
        </svg>

        {freeBidsPrompt}
      </div>
      <div className="flex w-full flex-row justify-between py-3">
        <div className="w-1/4">
          <span>
            {`Est value: `}
            <span className="text-sm font-bold md:block">
              ${itemData?.value?.toLocaleString()}
            </span>
          </span>
        </div>
        <div className={`border-l border-solid border-outerSpace-100`} />
        <div className="w-1/4">
          <span>
            {`Raised: `}
            <span className="text-sm font-bold md:block">
              ${auctionStats.totalRaised.toLocaleString()}
            </span>
          </span>
        </div>
        <div className="border-l border-solid border-outerSpace-100" />
        <div className="w-1/4">
          <span>
            {rightHandData.text}
            <span className="text-sm font-bold md:block">
              ${rightHandData.value}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
