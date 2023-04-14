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

import {
  preflightValidateBidAmount,
  addBidLock,
  addBid,
  updateAuctionWithBid,
  updateBidCompleteStatus,
  removeBidLockByAuctionId,
} from "~/hooks/useAuction";

import * as ga from "../../lib/ga";
import { useUserQuery } from "~/hooks/useUser";
import { useRouter } from "next/router";

interface PayPalDialogProps {
  bidValue: number;
  auction: any;
}

export const PayPalDialog = ({ bidValue, auction }: PayPalDialogProps) => {
  const userJWT = useUserQuery();
  const router = useRouter();

  // State of the Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // When the paypal button is clicked it signals to locks the
  // bidding for everyone and saves the lockId here
  const [bidLockId, setBidLockId] = useState<string>();

  // Track paypal calls
  const [paypalState, setPaypalState] = useState<
    "COMPLETED" | "CANCELLED" | "CREATE_ORDER" | "NOT_STARTED" | "ERROR"
  >("NOT_STARTED");

  // Open the bid now dialog and track its opening via google
  const openBidDialog = () => {
    setIsDialogOpen(true);
    // place the event tag inside the open dialog
    // otherwise you are only capturing pageLoad
    // not "button_click"
    ga.event({
      action: "button_click",
      params: { label: "Bid now", value: bidValue },
    });
  };

  // Sync the open/closed state of the Dialog
  // to this component
  // TODO: cancel and reset everything if user
  //       mistakenly hits the close via the
  //       dialog background
  useEffect(() => {}, [isDialogOpen]);

  // Rough state control flow for synchronizing the
  // paypal 3rd party system to the supabase system
  useEffect(() => {
    const startProcess = async () => {
      /** typeScript fix. userId will always be defined */
      const userIdTSFix = userJWT.data?.id ?? "";
      const preFlightCheckResult = await preflightValidateBidAmount(
        auction.auction_id,
        auction.increment,
        bidValue
      );
      const bidLockedResult = await addBidLock(auction.auction_id);

      const updateBidTableResults = await addBid(
        auction.auction_id,
        auction.charity_id,
        userIdTSFix,
        bidValue
      );

      setBidLockId(updateBidTableResults.bid[0].bid_id);

      // Check all three calls to make sure things are smooth
      // then update the component. We really need a "cancel"
      // paypal flow surfaced from the 3rd party component here
    };

    const completeBidProcess = async () => {
      /** typeScript fix. bidLockId will always be defined here */
      const bidLockIdTSFix = bidLockId ?? "";
      const updateAuctionResults = await updateAuctionWithBid(
        auction.auction_id,
        bidValue
      );
      const bidCompletedResults = await updateBidCompleteStatus(bidLockIdTSFix);
      const unlockBidResults = await removeBidLockByAuctionId(
        auction.auction_id
      );

      // Check all three calls to make sure things are smooth
      // then update the component. We really need a "cancel"
      // paypal flow surfaced from the 3rd party component here
      setBidLockId(undefined);

      // on complete, close the dialog and refresh the page to show the new amount on the button
      setIsDialogOpen(false);
      router.reload();
    };

    // if a user Id provided is undefined
    // we can assume its not authenticated because we get
    // it from the JWT
    if (userJWT.data?.id !== undefined) {
      // CREATE ORDER HOOK - Fired when you click paypal button
      if (isDialogOpen && !bidLockId && paypalState === "CREATE_ORDER") {
        startProcess();
      }
      // COMPLETES HOOK - Not sure when
      if (isDialogOpen && bidLockId && paypalState === "COMPLETED") {
        completeBidProcess();
      }
    }

    return () => {
      // clean up
    };
  }, [isDialogOpen, bidLockId, paypalState]);

  // paypal specific method
  const handleCreateOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    setPaypalState("CREATE_ORDER");
    return await actions.order?.create({
      purchase_units: [
        {
          amount: {
            value: bidValue.toString(10),
          },
        },
      ],
    });
  };

  // paypal specific method
  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    setPaypalState("COMPLETED");
    const details = await actions.order?.capture();
    const name = details?.payer?.name?.given_name ?? ""; // because capture() can be promise | undefined

    // this is where we'll do more with supabase on success
    alert(`GoodBid confirmed, thank you${name ? ` ${name}` : ""}!`);
  };

  // paypal specific method
  const handleCancel = async (
    data: Record<string, unknown>,
    actions: OnCancelledActions
  ) => {
    // this is where we'll update bid state to cancelled
    setPaypalState("CANCELLED");
    console.log("PP: cancel triggered", data);
  };

  // paypal specific method
  const handleError = async (error: Record<string, unknown>) => {
    // this is where we'll update bid state to error
    setPaypalState("ERROR");
    console.log("PP: error triggered", error);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          id="call-to-action"
          className="flex min-h-fit w-fit flex-col justify-center pb-4 pt-4"
        >
          <button
            className={`container rounded-full bg-bottleGreen px-8 py-4 text-xl font-bold text-hintOfGreen`}
            onClick={openBidDialog}
          >
            {`GoodBid $${bidValue} now`}
          </button>
        </div>
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
