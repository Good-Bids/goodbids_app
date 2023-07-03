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

interface FreeBidDialogProps {
  bidValue: number;
  auction: Auction;
  isBidLocked: boolean;
}

export const FreeBidDialog = ({
  bidValue,
  auction,
  isBidLocked,
}: FreeBidDialogProps) => {
  const { data: userData } = useUserQuery();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidId, setBidId] = useState<string>();
  const [errorState, setErrorState] = useState<Error>();
  const [modalText, setModalText] = useState<string>(
    "You won't be charged anything, and you'll become the high bidder."
  );
  const [actionButtonCopy, setActionButtonCopy] = useState<string>("confirm");
  const [bidState, setBidState] = useState<
    "PENDING" | "COMPLETE" | "CANCELLED" | "INACTIVE"
  >("INACTIVE");

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
      params: { label: "Bid now", value: bidValue },
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
    console.log({ userData, hasFreeBids, bidId });
    if (userData && hasFreeBids && bidId) {
      try {
        await redeemFreeBid.mutateAsync();
        await bidConfirmation.mutateAsync();
        setModalText("Free GoodBid successfully redeemed!");
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
              <p className="text-xl font-bold text-cw-blue">{`Place Free Bid (${freeBidsData.length} left)`}</p>
            </button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Use ${bidValue} Free Bid</DialogTitle>
          <DialogDescription>
            Click "confirm" to use your free bid
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <p className="text-sm font-light text-outerSpace-800">{modalText}</p>
          <p className="text-sm font-light text-outerSpace-800">
            {" "}
            if nobody else bids in the next {auction.increment} hours, you'll
            win!{" "}
          </p>
          <div className="flex h-fit flex-row justify-center gap-10 py-3">
            {bidId && (
              <button
                className="font-base rounded bg-cw-blue px-2 text-xl text-white"
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
