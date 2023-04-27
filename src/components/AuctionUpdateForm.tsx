import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserQuery } from "~/hooks/useUser";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useRouter } from "next/router";
import useSupabase from "~/hooks/useSupabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type AuctionFormValues = {
  name: string;
  description: string;
  opening_bid_value: number;
  increment: number;
  top_bid_duration: number;
  type: string;
  status: string;
  minimum_bids: number;
  bid_currency: string;
  allowed_free_bids: string[];
  over_bid_good_time_active: boolean;
  over_bid_good_time_early_fee: number;
  over_bid_good_time_often_fee: number;
  over_bid_good_time_late_fee: number;
};

const supabaseClient = useSupabase();

/**
 * QueryLoadingDisplay
 */
const QueryLoadingDisplay = () => {
  return <p>LOADING</p>;
};

/**
 * QueryErrorDisplay
 */
const QueryErrorDisplay = () => {
  return <p>ERROR</p>;
};

export const UpdateAuctionForm = () => {
  // Get user that is authenticated
  const userJWT = useUserQuery();
  // TODO: trigger redirect to auth page if no JWT or "LOGGED OUT"

  // Get incoming Auction Id
  const router = useRouter();
  const auctionId = router.query?.auctionId as string; // < router mess

  // form state
  const [updatesResult, setUpdateResult] =
    useState<PostgrestSingleResponse<null>>();

  // note is not capture all the result object, UI will be missing error
  // notifications that can be useful for display
  const { isLoading, data: auction, isError } = useAuctionQuery(auctionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuctionFormValues>();

  useEffect(() => {
    if (auction) {
      // reset FORM with auction details
      console.log("RESET and UPDATE form", auction);
      // casting feels wrong.
      // yet these values need to exist if the auction is in the table
      // in reality the defaults should not be undefined or null in the schema
      let mappedData = {
        name: auction.name as string,
        description: auction.description as string,
        opening_bid_value: auction.opening_bid_value as number,
        increment: auction.increment as number,
        top_bid_duration: auction.top_bid_duration as number,
        type: auction.type as string,
        status: auction.status as string,
        minimum_bids: auction.minimum_bids as number,
        bid_currency: auction.bid_currency as string,
        over_bid_good_time_active: auction.over_bid_good_time_active as boolean,
        over_bid_good_time_early_fee:
          auction.over_bid_good_time_early_fee as number,
        over_bid_good_time_often_fee:
          auction.over_bid_good_time_often_fee as number,
        over_bid_good_time_late_fee:
          auction.over_bid_good_time_late_fee as number,
      };
      reset(mappedData);
    }
  }, [auction]);

  const onSubmit: SubmitHandler<AuctionFormValues> = async (data) => {
    try {
      // manually spelled it out for transform and cleaning of vars prior to submit
      const result = await supabaseClient
        .from("auction")
        .update({
          allowed_free_bids: [], //data.allowed_free_bids,
          bid_currency: data.bid_currency,
          description: data.description,
          increment: data.increment,
          minimum_bids: data.minimum_bids,
          name: data.name,
          opening_bid_value: data.opening_bid_value,
          over_bid_good_time_active: data.over_bid_good_time_active,
          over_bid_good_time_early_fee: data.over_bid_good_time_early_fee,
          over_bid_good_time_late_fee: data.over_bid_good_time_late_fee,
          over_bid_good_time_often_fee: data.over_bid_good_time_often_fee,
          status: data.status,
          top_bid_duration: data.top_bid_duration,
          type: data.type,
        })
        .eq("auction_id", auction?.auction_id)
        .throwOnError();
      console.log("UPDATE COMPLETED", result);
      setUpdateResult(result);
    } catch (error: any) {
      console.log("UPDATE ERROR", error);
      setUpdateResult(error);
    }
  };

  // ReactQuery Status -> loading
  if (isLoading && isError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (!isLoading && isError) {
    return <QueryErrorDisplay />;
  }

  if (auction === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <form
      className="flex flex-col rounded-md border bg-slate-50"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row p-4">
        <div className="flex w-96 flex-shrink-0 flex-col pr-2">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Auction Name
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Auction Name"
            {...register("name", { required: true, max: 80, min: 10 })}
          />
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Auction description
          </label>
          <textarea
            rows={8}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Auction description"
            {...register("description", {
              required: true,
              max: 250,
              min: 10,
            })}
          />
          <label
            htmlFor="opening_bid_value"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Opening bid value
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Opening bid value"
            {...register("opening_bid_value", {
              required: true,
              max: 30,
              min: 1,
            })}
          />
          <label
            htmlFor="increment"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Bid increment
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Bid increment"
            {...register("increment", { required: true, max: 100, min: 1 })}
          />
          <label
            htmlFor="top_bid_duration"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Top bid duration
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Top bid duration, this is set to seconds"
            {...register("top_bid_duration", {
              required: true,
              max: 10000,
              min: 1,
            })}
          />
        </div>
        <div className="flex w-96 flex-shrink-0 flex-col pl-2">
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Auction Type
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="STANDARD"
            {...register("type", { required: true, max: 10 })}
          />
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Auction Status
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="DRAFT"
            {...register("status", { required: true, max: 10 })}
          />
          <label
            htmlFor="minimum_bids"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Minimum Bids
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="10"
            {...register("minimum_bids", { required: true })}
          />
          <label
            htmlFor="bid_currency"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Bid Currency (iso 3 char) should match paypal iso list
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="USD"
            {...register("bid_currency", { required: true })}
          />
          <label
            htmlFor="allowed_free_bids"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Allowed Free Bids
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="unknown values"
            {...register("allowed_free_bids")}
          />
          <label
            htmlFor="over_bid_good_time_active"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            over bid good time active
          </label>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="TRUE"
            {...register("over_bid_good_time_active")}
          />
          <label
            htmlFor="over_bid_good_time_early_fee"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            over bid good time early fee
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
            {...register("over_bid_good_time_early_fee")}
          />
          <label
            htmlFor="over_bid_good_time_often_fee"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            over bid good time often fee
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
            {...register("over_bid_good_time_often_fee")}
          />
          <label
            htmlFor="over_bid_good_time_late_fee"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            over bid good time late fee
          </label>
          <input
            type="number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder=""
            {...register("over_bid_good_time_late_fee")}
          />
        </div>
      </div>
      <div className="flex w-full flex-row border-t">
        <div className="flex flex-grow items-center pl-4">
          <p className="text-sm text-neutral-300">
            {updatesResult === undefined
              ? "form status/errors info here"
              : updatesResult.status}
          </p>
        </div>
        <div className="p-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          >
            UPDATE
          </button>
        </div>
      </div>
    </form>
  );
};
