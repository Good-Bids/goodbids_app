import React, { useState, useEffect } from "react";

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

import * as ga from "../../lib/ga";
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
      return await actions.order?.create({
        purchase_units: [
          {
            amount: {
              value: bidValue.toString(10),
            },
          },
        ],
      });
    } catch (err) {
      throw err;
    }
  };

  // paypal specific method
  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    try {
      const details = await actions.order?.capture();
      const confirmation = await bidConfirmation.mutateAsync();
      setIsDialogOpen(false);
      router.reload();
      const name = details?.payer?.name?.given_name ?? ""; // because capture() can be promise | undefined

      alert(`GoodBid confirmed, thank you${name ? ` ${name}` : ""}!`);
    } catch (err) {
      throw err;
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
    const cancellation = await bidCancellation.mutateAsync();
  };

  const handleOpenChange = async (openChangeTo: boolean) => {
    if (openChangeTo) {
      setIsDialogOpen(openChangeTo);
    } else {
      setIsDialogOpen(openChangeTo);
      setBidState("CANCELLED");
      await bidCancellation.mutateAsync();
      setBidId("");
      console.log({ openChangeTo, bidId, bidState });
    }
  };
  console.log({ isDialogOpen, bidId, bidState });

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isBidLocked ? (
          <button
            className={`container rounded-full bg-outerSpace-200 px-8 py-4 text-sm font-bold text-bottleGreen`}
            disabled
          >
            {`Someone else is placing a bid right now`}.
          </button>
        ) : (
          <div
            id="call-to-action"
            className="fixed bottom-2 left-4 flex min-h-fit w-11/12 flex-col justify-center pb-4 pt-4 sm:relative sm:left-0 sm:w-fit"
          >
            <button
              className={`container rounded-full bg-bottleGreen px-8 py-4 text-xl font-bold text-hintOfGreen`}
              onClick={openBidDialog}
            >
              {`GoodBid $${bidValue} now`}
            </button>
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
