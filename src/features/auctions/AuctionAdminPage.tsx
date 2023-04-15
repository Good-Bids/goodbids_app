/**
 * AuctionAdminPage
 *
 * once a user has the 'charityAdmin' role,
 * they can create auctions for their charity.
 *
 * The page requires a CHARITY_ID to be provided
 *
 * TODO: need to get a validation lib
 * and proper error correction and display
 *
 * #note: the policy in the auctions table designates
 * that the charity admin id matches the auth id. In the
 * charity admin table this is not the case.
 * I manually altered my charity admin id to match my user id
 * to make this work
 *
 */

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserQuery } from "~/hooks/useUser";
import { useAuctionQuery } from "~/hooks/useAuction";
import { useRouter } from "next/router";
import useSupabase from "~/hooks/useSupabase";

type T_FormValues = {
  name: string;
  description: string;
  opening_bid_value: number;
  increment: number;
  top_bid_duration: number;
};

const supabaseClient = useSupabase();

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {
  return <p>LOADING</p>;
};

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {
  return <p>ERROR</p>;
};

export const AuctionAdminPage = () => {
  // Get user that is authenticated
  const userJWT = useUserQuery();
  // TODO: trigger redirect to auth page if no JWT or "LOGGED OUT"

  // Get incoming Auction Id
  const router = useRouter();
  const auctionId = router.query?.auctionId as string; // < router mess
  // note is not capture all the result object, UI will be missing error
  // notifications that can be useful for display
  const { queryStatus, auction, hasError } = useAuctionQuery(auctionId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T_FormValues>();

  useEffect(() => {
    if (auction !== undefined) {
      // reset FORM with auction details
      console.log("RESET and UPDATE form", auction);
      // casting feels very wrong.
      // yet these values need to exist if the auction is in the table
      // in reality the defaults should not be undefined or null in the schema
      let mappedData = {
        name: auction.name as string,
        description: auction.description as string,
        opening_bid_value: auction.opening_bid_value as number,
        increment: auction.increment as number,
        top_bid_duration: auction.top_bid_duration as number,
      };
      reset(mappedData);
    }
  }, [auction]);

  const onSubmit: SubmitHandler<T_FormValues> = async (data) => {
    try {
      const result = await supabaseClient
        .from("auction")
        .insert([
          {
            charity_id: "",
            name: data.name,
            description: data.description,
            opening_bid_value: data.opening_bid_value,
            increment: data.increment,
            top_bid_duration: data.top_bid_duration,
          },
        ])
        .throwOnError();
      console.log("SUBMIT COMPLETED", result);
    } catch (error) {
      console.log("SUBMIT ERROR", error);
    }
  };

  // ReactQuery Status -> loading
  if (queryStatus.isLoading && queryStatus.isError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (!queryStatus.isLoading === false && hasError) {
    return <QueryErrorDisplay />;
  }

  if (auction === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <div className="flex flex-col w-full p-6 border rounded-md bg-slate-50">
      <form className="w-96" onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium text-gray-900"
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
          className="block mb-2 text-sm font-medium text-gray-900"
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
          className="block mb-2 text-sm font-medium text-gray-900"
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
          className="block mb-2 text-sm font-medium text-gray-900"
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
          className="block mb-2 text-sm font-medium text-gray-900"
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

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
