import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/Dialog";

import { useBidMutation, useBidsByAuction } from "~/hooks/useAuction";

import * as ga from "../../analytics/ga";
import { useUserQuery } from "~/hooks/useUser";
import { useRouter } from "next/router";
import { Auction } from "~/utils/types/auctions";
import {
  FreeBidType,
  useFreeBidsMutation,
  useFreeBidsQuery,
} from "~/hooks/useFreeBids";
import { charityColorTailwindString } from "~/utils/constants";

interface FreeBidDialogProps {
  bidValue: number;
  auction: Auction;
  isBidLocked: boolean;
  charity: "buildOn" | "charityWater";
}

export const FreeBidDialog = ({
  bidValue,
  auction,
  isBidLocked,
  charity,
}: FreeBidDialogProps) => {
  const { data: userData } = useUserQuery();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidId, setBidId] = useState<string>();
  const [errorState, setErrorState] = useState<Error>();
  const [modalText, setModalText] = useState<string[]>([
    `You won't be charged anything.`,
    `You'll become the high bidder.`,
    `If nobody else bids in the next ${auction.increment} hours, you'll
    win!`,
  ]);
  const [actionButtonCopy, setActionButtonCopy] = useState<string>("confirm");
  const [bidState, setBidState] = useState<
    "PENDING" | "COMPLETE" | "CANCELLED" | "INACTIVE"
  >("INACTIVE");

  const colorString = charityColorTailwindString[charity];

  // Open the bid now dialog and track its opening via google
  const openBidDialog = async () => {
    if (userData?.id === undefined) {
      await router.push("/LogIn");
    }
    setIsDialogOpen(true);
    // place the event tag inside the open dialog
    // otherwise you are only capturing pageLoad
    // not "button_click"
    ga.event({
      action: "button_click",
      params: { label: "FreeBid now", value: bidValue },
    });
    setBidState("PENDING");
  };

  const pendingBidCreation = useBidMutation({
    auctionId: auction.auction_id,
    userId: userData?.id ?? "",
    bidAmount: bidValue,
    bidState: "PENDING",
  });
  const bidConfirmation = useBidMutation({
    auctionId: auction.auction_id,
    userId: userData?.id ?? "",
    bidAmount: bidValue,
    bidState: "COMPLETE",
    bidId,
  });
  const bidCancellation = useBidMutation({
    auctionId: auction.auction_id,
    userId: userData?.id ?? "",
    bidAmount: bidValue,
    bidState: "CANCELLED",
    bidId,
  });

  const { data: freeBidsData } = useFreeBidsQuery({
    userId: userData?.id ?? "",
    auctionId: auction.auction_id,
  });
  const hasFreeBids = freeBidsData && freeBidsData.length > 0;

  const redeemFreeBid = useFreeBidsMutation({
    userId: userData?.id ?? "",
    auctionId: auction.auction_id,
    action: "redeem",
    freeBidId: freeBidsData?.[0]?.free_bid_id,
    type: freeBidsData?.[0]?.free_bid_type as FreeBidType,
  });

  const handleFreeBidRedemption = async () => {
    if (userData && hasFreeBids && bidId) {
      try {
        await redeemFreeBid.mutateAsync();
        await bidConfirmation.mutateAsync();
        setModalText(["Free GoodBid successfully redeemed!"]);
        setActionButtonCopy("close window");
        setBidState("COMPLETE");
      } catch (err) {
        throw err;
      }
    }
  };

  const handleOpenChange = async (changeIsOpenTo: boolean) => {
    switch (changeIsOpenTo) {
      case true:
        {
          setIsDialogOpen(changeIsOpenTo);
          await pendingBidCreation.mutateAsync().then((response) => {
            setBidId(response?.bidId);
          });
        }
        break;
      case false: {
        console.log("closing");
        setIsDialogOpen(changeIsOpenTo);
        if (bidState !== "COMPLETE") {
          console.log("cancelling!");
          setBidState("CANCELLED");
          await bidCancellation.mutateAsync();
          setBidId("");
        }
      }
    }
  };

  const isLatestBidder = auction.latest_bidder_id === userData?.id;

  const canBid = !isBidLocked && !isLatestBidder;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {errorState && (
        <div className=" bg-cornflowerLilac text-pompadour">
          <p>{errorState.message}</p>
          <button
            className="rounded-full border-black"
            onClick={() => setErrorState(undefined)}
          >
            okay
          </button>
        </div>
      )}
      <DialogTrigger asChild>
        <div
          id="call-to-action"
          className="mx-4 flex  min-h-fit w-11/12 flex-col justify-center gap-2 sm:relative sm:left-0 sm:w-fit"
        >
          {canBid && hasFreeBids && (
            <button
              className="rounded border-2 border-solid border-black border-opacity-30 px-4 py-3"
              onClick={openBidDialog}
            >
              <p
                className={`text-xl font-bold text-${colorString}`}
              >{`Place Free Bid (${freeBidsData.length} left)`}</p>
            </button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="p-2 pb-0 text-center text-2xl text-bo-red">
              Use ${bidValue - auction.increment} Free Bid
            </p>
          </DialogTitle>
          <DialogDescription>
            <p className="p-2 pt-0 text-center">
              Click "confirm" to use your free bid
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col p-2">
          {bidState !== "COMPLETE" && (
            <p className="text-center text-xl font-bold">How it works:</p>
          )}
          {modalText.map((text) => (
            <p className="pt-1 text-center text-lg font-light text-outerSpace-800">
              {text}
            </p>
          ))}
          <div className="flex h-fit flex-row justify-center gap-10 py-3">
            {bidId && (
              <button
                className={`font-base rounded bg-${colorString} px-2 text-xl text-white`}
                onClick={() => {
                  bidState === "COMPLETE"
                    ? handleOpenChange(false)
                    : handleFreeBidRedemption();
                }}
              >
                {actionButtonCopy}
              </button>
            )}
            {bidState !== "COMPLETE" && (
              <button
                className="cursor-pointer rounded border-2 border-outerSpace-200 px-2 text-xl text-outerSpace-500"
                onClick={() => handleOpenChange(false)}
              >
                cancel
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
