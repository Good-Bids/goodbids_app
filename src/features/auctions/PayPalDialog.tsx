import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from 'src/components/Dialog'
import { useState } from 'react';

import { initialOptions } from '~/utils/constants';

interface PayPalDialogProps {
  bidValue: number
}

export const PayPalDialog = ({ bidValue }: PayPalDialogProps) => {

  const [open, setOpen] = useState(false);

  const handleBidClick = () => {
    setOpen(true)
    // also will need to write to bids table with status of pending
  }
  const handleCreateOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order?.create({
      purchase_units: [
        {
          amount: {
            value: bidValue.toString(10),
          },
        },
      ],
    });
  }

  const handleApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture()
    const name = details?.payer?.name?.given_name ?? 'an unknown GoodBidder' // because capture() can be promise | undefined
    alert(`Transaction completed by ${name}`)
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <div id="call-to-action" className="flex flex-col justify-center pt-4 pb-4 min-h-fit w-fit">
          <button
            className={`container bg-bottleGreen text-hintOfGreen rounded-full font-bold py-4 px-8 text-xl`}
            onClick={() => handleBidClick}
          >
            {`GoodBid $${bidValue} now`}
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Goodbid ${bidValue}
          </DialogTitle>
          <DialogDescription>
            Don't worry, this is still just a test. You won't be charged, I promise.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
            />
          </PayPalScriptProvider>
        </div>
      </DialogContent>
    </Dialog>
  )

}