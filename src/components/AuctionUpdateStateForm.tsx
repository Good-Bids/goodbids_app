import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserQuery } from "~/hooks/useUser";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useRouter } from "next/router";
import useSupabase from "~/hooks/useSupabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type T_FormValues = {
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

export const UpdateAuctionStateForm = () => {
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
  } = useForm<T_FormValues>();

  useEffect(() => {
    if (auction) {
      // reset FORM with auction details
      console.log("RESET and UPDATE form", auction);
      // casting feels wrong.
      // yet these values need to exist if the auction is in the table
      // in reality the defaults should not be undefined or null in the schema
      let mappedData = {
        status: auction.status as string,
      };
      reset(mappedData);
    }
  }, [auction]);

  const onSubmit: SubmitHandler<T_FormValues> = async (data) => {
    try {
      // manually spelled it out for transform and cleaning of vars prior to submit
      const result = await supabaseClient
        .from("auction")
        .update({
          status: data.status,
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
      className="flex w-full flex-col rounded-md border bg-slate-50"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row p-4">
        <div className="flex w-96 flex-shrink-0 flex-col">
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
                UPDATE STATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
