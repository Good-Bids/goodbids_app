import { useRouter } from "next/router";
import { useAuctionQuery } from "~/hooks/useAuction";
import { I_AuctionRowModel } from "~/utils/types/auctions";
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { env } from "~/env.mjs";
import { Button } from "~/components/Button";
import { useAuctionQuery } from "~/hooks/useAuction";

const initialOptions = {
  "client-id": env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

/**
 * TODO: move links to backend server into:
 * 1. possibly the db itself so that links are hydrated via the row call
 * 2. env app bootstrap fields
 */
const fileStoragePath: string = "https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {
  return (
    <p>LOADING</p>
  )
}

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {
  return (
    <p>ERROR</p>
  )
}

  const imageUrl = `https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets/${auction?.auction_id}/sample-item-1298792.jpg`



  if (auction) {
    const currentHighBid = auction.high_bid_value ?? 0
    const nextBidValue = currentHighBid + auction.increment
    
    const handleCreateOrder = (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: nextBidValue,
            },
          },
        ],
      });
    }

    const handleApprove = async (data: any, actions: { order: { capture: () => Promise<any>; }; }) => {
      const details = await actions.order.capture()
      const name = details.payer.name.given_name
      alert(`Transaction completed by ${name}`)
    }

    return (<>
      <h1 className="text-6xl text-black font-bold">{auction.name}</h1>
      <Image src={imageUrl} alt={'item to be won'} width={240} height={240} />
      <p>status: {auction.status}</p>
      <p>current High Bid: ${currentHighBid}</p>
      <p>{auction.description}</p>
      <p >supports{' '}
        <Link href={`/charities/${auction.charity_id}`} className="hover:underline decoration-screaminGreen">
          {auction.charity_id}
        </Link>
      </p>
      <Button
        text={`Bid $${nextBidValue} now`}
        color='bottleGreen'
        textColor='screaminGreen'
        onClick={() => console.log('bid!')} />
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />
      </PayPalScriptProvider>
    </>)
  }

  return (
    < div className="flex flex-col flex-grow w-full p-24" >
      {/* temp container for testing hook query status and errors */}
      <p className="text-xs text-neutral-800 bg-slate-50 pl-2 pt-2 pb-2 mb-2">query: status: {query.queryStatus.isLoading ? "loading" : "done"}</p>

      {/* temp container for Auction Detail View module */}
      <div className="flex flex-col flex-grow w-full">
        <AuctionDetails auction={query.auction} />
      </div>

    </div>
  )
}

