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

import { useBidMutation } from "~/hooks/useAuction";

import * as ga from "../../analytics/ga";
import { useUserQuery } from "~/hooks/useUser";
import { useRouter } from "next/router";
import { Auction } from "~/utils/types/auctions";

interface PayPalDialogProps {
  bidValue: number;
  auction: Auction;
  isBidLocked: boolean;
}

export const PayPalDialog = ({
  bidValue,
  auction,
  isBidLocked,
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
      const confirmation = await bidConfirmation.mutateAsync();
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
    const cancellation = await bidCancellation.mutateAsync();
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
        {!canBid ? (
          <button
            className={`container rounded-full bg-bottleGreen px-8 py-4 text-sm font-bold text-hintOfGreen opacity-40`}
            disabled
          >
            {isLatestBidder
              ? "Thanks for your bid!"
              : `Someone else is placing a bid right now`}
            .
          </button>
        ) : (
          <div
            id="call-to-action"
            className="fixed bottom-2 left-4 flex min-h-fit w-11/12 justify-center gap-2 pb-4 pt-4 sm:relative sm:left-0 sm:w-fit sm:flex-col md:flex-row"
          >
            <button
              className={`container rounded-full bg-bottleGreen px-8 py-4 text-xl font-bold text-hintOfGreen`}
              onClick={openBidDialog}
            >
              {`GoodBid $${bidValue} now`}
            </button>
            <div className="text-wrap flex w-fit items-center">
              <p className="text-sm font-normal text-outerSpace-900 md:visible">
                Every GoodBid is a donation.
              </p>
            </div>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>GoodBid ${bidValue}</DialogTitle>
          <DialogDescription>
            Don&apos;t worry, this is still just a test. You won&apos;t be
            charged, I promise.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
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
