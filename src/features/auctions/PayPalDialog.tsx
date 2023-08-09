import React, { useState } from "react";

import type {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
  OnCancelledActions,
} from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

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
import { useFreeBidsMutation, useFreeBidsQuery } from "~/hooks/useFreeBids";
import { charityColorTailwindString } from "~/utils/constants";

interface PayPalDialogProps {
  bidValue: number;
  auction: Auction;
  isBidLocked: boolean;
  charity: "buildOn" | "charityWater";
}

export const PayPalDialog = ({
  bidValue,
  auction,
  isBidLocked,
  charity,
}: PayPalDialogProps) => {
  const { data: userData } = useUserQuery();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bidId, setBidId] = useState<string>();
  const [errorState, setErrorState] = useState<Error>();
  const [bidState, setBidState] = useState<
    "PENDING" | "COMPLETE" | "CANCELLED" | "INACTIVE"
  >("INACTIVE");

  // Open the bid now dialog and track its opening via google
  const openBidDialog = async () => {
    if (userData?.id === undefined) {
      await router.push("/auth-login");
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

  const earnFreeBidEarlyBid = useFreeBidsMutation({
    userId: userData?.id ?? "",
    auctionId: auction.auction_id,
    action: "earn",
    type: "bid_early",
  });

  const earnFreeBidOftenBid = useFreeBidsMutation({
    userId: userData?.id ?? "",
    auctionId: auction.auction_id,
    action: "earn",
    type: "bid_often",
  });

  const { data: bidsData } = useBidsByAuction(auction.auction_id);

  const { data: freeBidsData } = useFreeBidsQuery({
    userId: userData?.id ?? "",
    auctionId: auction.auction_id,
  });
  const hasFreeBids = freeBidsData && freeBidsData.length > 0;
  const hasFreeEarlyBid =
    hasFreeBids &&
    freeBidsData.some((item) => item.free_bid_type === "bid_early");
  const hasFreeOftenBid =
    hasFreeBids &&
    freeBidsData.some((item) => item.free_bid_type === "bid_often");
  const canEarnFreeEarlyBid =
    bidsData && bidsData.length <= 10 && !hasFreeEarlyBid;
  const canEarnFreeOftenBid =
    bidsData &&
    bidsData.filter((item) => item.bidder_id === userData?.id).length > 2 &&
    !hasFreeOftenBid;

  const handleEarnFreeBid = async () => {
    if (userData && bidsData) {
      try {
        if (canEarnFreeEarlyBid && !hasFreeEarlyBid) {
          return await earnFreeBidEarlyBid.mutateAsync();
          // TODO add success toast?
          // or success message?
          // maybe email message?
        }
        if (canEarnFreeOftenBid && !hasFreeOftenBid) {
          return await earnFreeBidOftenBid.mutateAsync();
          // TODO add success toast?
          // or success message?
          // maybe email message?
        }
      } catch (err) {
        throw err;
      }
    }
  };

  // paypal specific method
  const handleCreateOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    try {
      const pendingGoodBid = await pendingBidCreation.mutateAsync();
      setBidId(pendingGoodBid?.bidId);
      const create = await actions.order?.create({
        purchase_units: [
          {
            amount: {
              value: bidValue.toString(10),
            },
          },
        ],
      });
      return create;
    } catch (err) {
      if (err instanceof Error) {
        console.error({ err });
        setErrorState(err);
      } else
        setErrorState({
          name: "orderCreationError",
          message:
            "Sorry! there was an error in order creation. Please try again.",
        });
    }
    return "ok";
  };

  // paypal specific method
  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    try {
      await actions.order?.capture();
      await bidConfirmation.mutateAsync();
      await handleEarnFreeBid();
      setIsDialogOpen(false);
      router.reload();
    } catch (err) {
      if (err instanceof Error) {
        setErrorState(err);
      } else
        setErrorState({
          name: "orderCreationError",
          message:
            "Sorry! there was an error in order creation. Please try again.",
        });
    }
  };

  // paypal specific method
  const handleCancel = async (
    data: Record<string, unknown>,
    actions: OnCancelledActions
  ) => {
    actions.redirect();
    return await bidCancellation.mutateAsync();
  };

  // paypal specific method
  const handleError = async (error: Record<string, unknown>) => {
    setErrorState({
      name: error["name"]?.toString() ?? "paypal error",
      message: error["message"]?.toString() ?? "there was an error with paypal",
    });
  };

  const handleOpenChange = async (changeIsOpenTo: boolean) => {
    switch (changeIsOpenTo) {
      case true:
        {
          setIsDialogOpen(changeIsOpenTo);
          window.setTimeout(() => {
            setIsDialogOpen(false);
          }, 300_000);
        }
        break;
      case false: {
        console.info("closing");
        setIsDialogOpen(changeIsOpenTo);
        if (bidState !== "COMPLETE") {
          console.info("cancelling");
          setBidState("CANCELLED");
          await bidCancellation.mutateAsync();
          setBidId("");
        }
      }
    }
  };

  const isLatestBidder = auction.latest_bidder_id === userData?.id;

  const canBid = !isBidLocked && !isLatestBidder;

  const colorString = charityColorTailwindString[charity];

  const dynamicValue =
    bidState === "PENDING" ? bidValue - auction.increment : bidValue;

  const cleanBidValue =
    Math.floor(dynamicValue) < dynamicValue
      ? dynamicValue.toFixed(2)
      : dynamicValue;

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {errorState && (
        <div className=" bg-cornflowerLilac text-pompadour">
          <p>{errorState.message}</p>
          <button
            className="container w-fit rounded-full border-2 border-solid border-black px-3"
            onClick={() => setErrorState(undefined)}
          >
            okay
          </button>
        </div>
      )}
      <DialogTrigger asChild>
        <div
          id="call-to-action"
          className="mx-4 flex  min-h-fit w-11/12 flex-col justify-center gap-2 sm:relative sm:left-0"
        >
          {isLatestBidder ? (
            <p className="rounded bg-outerSpace-50 bg-opacity-50 py-2 text-center text-base font-bold">
              Thanks for your bid!
              <p className="text-center text-xs font-normal">
                If someone outbids you, you'll be able to bid again.
              </p>
            </p>
          ) : (
            <>
              <button
                className={`container rounded border-2 border-${colorString} bg-${colorString} px-4 py-3 text-xl font-bold text-white`}
                onClick={openBidDialog}
              >
                <p className="text-xl font-bold text-white">
                  {!canBid
                    ? `Someone else is placing a bid right now.`
                    : !!userData
                    ? `GoodBid $${cleanBidValue} now`
                    : `Log in now to bid $${cleanBidValue}`}
                </p>
              </button>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto py-2 sm:max-h-[85vh] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="p-2 text-center">
              GoodBid ${cleanBidValue} for {auction.name}
            </p>
          </DialogTitle>
          <DialogDescription>
            <p className="p-2">
              Every Bid is a Donation, and every Donation is a Bid.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col p-2">
          <PayPalButtons
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onError={handleError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
