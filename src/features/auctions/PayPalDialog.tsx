import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/Dialog";
import { useState } from "react";

import { initialOptions } from "~/utils/constants";

import * as ga from "../../lib/ga";

interface PayPalDialogProps {
  bidValue: number;
}

export const PayPalDialog = ({ bidValue }: PayPalDialogProps) => {
  const [open, setOpen] = useState(false);

  ga.event({
    action: "button_click",
    params: { label: "Bid now", value: bidValue },
  });

  const handleBidClick = () => {
    setOpen(true);
    // also will need to write to bids table with status of pending
  };
  const handleCreateOrder = (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    return actions.order?.create({
      purchase_units: [
        {
          amount: {
            value: bidValue.toString(10),
          },
        },
      ],
    });
  };

  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    const details = await actions.order?.capture();
    const name = details?.payer?.name?.given_name ?? "an unknown GoodBidder"; // because capture() can be promise | undefined
    alert(`Transaction completed by ${name}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          id="call-to-action"
          className="flex min-h-fit w-fit flex-col justify-center pb-4 pt-4"
        >
          <button
            className={`container rounded-full bg-bottleGreen px-8 py-4 text-xl font-bold text-hintOfGreen`}
            onClick={() => handleBidClick}
          >
            {`GoodBid $${bidValue} now`}
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Goodbid ${bidValue}</DialogTitle>
          <DialogDescription>
            Don't worry, this is still just a test. You won't be charged, I
            promise.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <PayPalButtons
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
