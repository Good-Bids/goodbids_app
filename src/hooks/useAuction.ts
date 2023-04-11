import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

type T_SupabaseBidReturnObject = {
  status: number;
  statusMessage: string;
  bid: any;
  hasError: boolean;
  rawError: any | null;
};

type T_SupabaseAuctionReturnObject = {
  status: number;
  statusMessage: string;
  auction: any;
  hasError: boolean;
  rawError: any | null;
};

interface I_SupabaseBidVariables {
  auctionId: string;
  charityId: string;
  userId: string;
  amount: number;
}

interface I_SupabaseAuctionBidVariables {
  auctionId: string;
  newBidValue: number;
}

interface I_SupabaseUpdateBidVariables {
  bidId: string;
}

/**
 * getAuction
 *
 * ServerSide - false
 *
 * Supabase call that fetches a single auction Via
 * createBrowserSupabaseClient helper client from
 * @supabase/auth-helpers-nextjs
 *
 * @param auctionId
 */
const getAuction = async (auctionId: string) => {
  try {
    const result = await supabaseClient
      .from("auction")
      .select(
        `
      *,
      bids: bid(*)
      `
      )
      .eq("auction_id", auctionId)
      .limit(1)
      .single()
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      auction: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      auction: undefined,
      hasError: true,
      rawError: err,
    };
  }
};

/**
 * useAuctionQuery
 *
 * ServerSide - false
 *
 * React hook that fetches a single Auction Via
 * createBrowserSupabaseClient wrapped in ReactQuery.
 *
 * React query returns required UI data on top of errors that can
 * be surfaced. Since this is also wrapping the Supabase query and its
 * errors ( can be network or db related etc )
 *
 * Error from ReactQuery is in error
 * Error from SubQuery with Supabase is in data
 *
 * TODO: validate auctionId and strip it from possible misuse
 * its passed directly from the address bar into this query
 *
 * return types are inferred
 */
export const useAuctionQuery = (auctionId?: string | undefined) => {
  // below in temporary - short circuit
  if (auctionId === undefined) {
    return {
      queryStatus: {
        isLoading: false,
        isError: false,
      },
      auction: undefined,
      hasError: true,
      errorMessage: "Invalid auction ID",
      errorObj: {
        code: "5000",
        message: "Invalid auction ID",
      },
    } as const;
  }

  const {
    isLoading,
    isError,
    isSuccess,
    data,
    error,
    dataUpdatedAt,
    errorUpdatedAt,
  } = useQuery({
    queryKey: ["auctionQueryResults", auctionId],
    queryFn: async () => {
      return await getAuction(auctionId);
    },
  });

  return {
    queryStatus: {
      isLoading,
      isError,
      updatedAt: isError
        ? new Date(errorUpdatedAt)
        : isSuccess
        ? new Date(dataUpdatedAt)
        : null,
    },
    auction: data?.auction ?? undefined,
    hasError: data?.hasError || isError ? true : false,
    errorMessage:
      data?.hasError || isError
        ? data?.statusMessage ?? "React Query encountered an error"
        : "",
    errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
  } as const;
};

/**
 * getAuctions
 *
 * ServerSide - false
 *
 * Get a collection of Auctions hydrated with bid objects. Use Limit and range
 * for pagination and also allow calling based on auctionStatus
 *
 * Supabase call that fetches Via createBrowserSupabaseClient
 * helper client from @supabase/auth-helpers-nextjs
 *
 * #note: https://github.com/supabase/postgrest-js/commit/9df1e84750a2d83552d540e711c345b00f3ec1b3
 * from above link - pulling out the returned value and allowing all errors to be surfaced
 *
 * Using temporary mapped error code for inside app errors
 * 5000 - getAuctions undefined error ( no code given by supabase )
 *
 * Types are inferred from supabase DB <database>
 *
 * Note: react query does not have classic query building so you can not build a
 * query and run it so we have to use an if
 *
 */
const getAuctions = async (
  auctionStatus = "ACTIVE",
  windowStart = 0,
  windowLength = 25
) => {
  try {
    let result;

    if (auctionStatus === "*") {
      result = await supabaseClient
        .from("auction")
        .select(
          `
        *,
        bids: bid(*)
      `
        )
        // .returns<I_AuctionModel>()
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();
    } else {
      result = await supabaseClient
        .from("auction")
        .select(
          `
        *,
        bids: bid(*)
      `
        )
        // .returns<I_AuctionModel>()
        .eq("status", auctionStatus)
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();
    }

    return {
      status: result.status,
      statusMessage: result.statusText,
      auctions: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      auctions: [],
      hasError: true,
      rawError: err,
    };
  }
};

/**
 * useAuctionsQuery
 *
 * ServerSide - false
 *
 * React hook that fetches Via createBrowserSupabaseClient
 * wrapped in ReactQuery.
 *
 * React query returns required UI data on top of errors that can
 * be surfaced. Since this is also wrapping the Supabase query and its
 * errors ( can be network or db related etc )
 *
 * Error from ReactQuery is in error
 * Error from SubQuery with Supabase is in data
 *
 * return types are inferred
 */
export const useAuctionsQuery = (
  auctionStatus?: string | undefined,
  windowStart = 0,
  windowLength = 0
) => {
  const [queryParameters, setQueryParameters] = useState({
    auctionStatus: auctionStatus ?? "*",
    windowStart: 0,
    windowLength: 25,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "auctionCollectionQueryResults",
      queryParameters.auctionStatus,
      queryParameters.windowStart,
      queryParameters.windowLength,
    ],
    queryFn: async () => {
      return await getAuctions(
        queryParameters.auctionStatus,
        queryParameters.windowStart,
        queryParameters.windowLength
      );
    },
  });

  return [
    {
      queryStatus: {
        isLoading,
        isError,
      },
      auctions: data?.auctions ?? [],
      hasError: data?.hasError || isError ? true : false,
      errorMessage:
        data?.hasError || isError
          ? data?.statusMessage ?? "React Query encountered an error"
          : "",
      errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
    },
    setQueryParameters,
  ] as const;
};

/**
 * preflightValidateBidAmount
 *
 * check to see if the DB currentBidValue + increment value
 * will be larger than the newBidValue. If it is then something
 * is wrong and a race condition was hit
 * Also: would be better to validate against the next increment
 * to ensure amount is matched correctly
 *
 * async
 *
 * @param auctionId string
 * @param bidIncrement number
 * @param newBidValue number
 * @returns object
 */
export const preflightValidateBidAmount = async (
  auctionId: string,
  bidIncrement: number,
  newBidValue: number
) => {
  try {
    let result;
    let isValidBidAmount = false;

    result = await supabaseClient
      .from("auction")
      .select("high_bid_value")
      .eq("auction_id", auctionId)
      .limit(1)
      .throwOnError();

    if (result.data !== null) {
      if (result.data[0] !== undefined) {
        let currentBidValue = result.data[0].high_bid_value ?? 0;
        if (currentBidValue + bidIncrement <= newBidValue) {
          isValidBidAmount = true;
        }
      }
    }

    return {
      status: result.status,
      statusMessage: result.statusText,
      bidAmountValid: isValidBidAmount,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      bidAmountValid: false,
      hasError: true,
      rawError: err,
    };
  }
};

/**
 * updateAuctionWithBid
 *
 * Note: Supabase v2 api calls do not hydrate a new model
 * they return a 204 after the patch is called. This is opposite
 * from v1. So v2 supports getting the return updated object
 * via a second select.
 *
 * async
 *
 * @param auctionId string
 * @param newBidValue number
 * @returns object
 */
export const updateAuctionWithBid = async (
  auctionId: string,
  newBidValue: number
): Promise<T_SupabaseAuctionReturnObject> => {
  try {
    let result;

    result = await supabaseClient
      .from("auction")
      .update({ high_bid_value: newBidValue })
      .eq("auction_id", auctionId)
      .select(
        `
          *,
          bids: bid(*)
        `
      )
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      auction: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      auction: [],
      hasError: true,
      rawError: err,
    };
  }
};

/**
 * useAddBidToAuction
 *
 * Wrapper around the Supabase call to update the auction table in the
 * backend with the new current bid value
 *
 * This is a hook wrapping a hook, the mutate method provided by RQuery
 * is responsible for the input types so we use I_SupabaseAuctionBidVariables
 * for hard typing the value
 *
 * Note: we call this with mutateAsync. So that we can Await
 * and possibly role back or deal with multistage UI
 *
 * TODO: Check error results and "query states". Also need to verify if
 * we can remove the async/await in the mutationFn as I think they do not
 * do anything.
 *
 * @returns Object
 */
export const useAddBidToAuctionTable = () => {
  const queryClient = useQueryClient();
  const { isError, isLoading, error, data, mutateAsync } = useMutation({
    mutationFn: async (data: I_SupabaseAuctionBidVariables) => {
      return await updateAuctionWithBid(data.auctionId, data.newBidValue);
    },
  });

  return [
    {
      queryStatus: {
        isLoading,
        isError,
      },
      auction: data?.auction ?? undefined,
      hasError: data?.hasError || isError ? true : false,
      errorMessage:
        data?.hasError || isError
          ? data?.statusMessage ?? "React Query encountered an error"
          : "",
      errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
    },
    mutateAsync,
  ] as const;
};

/**
 * addBid
 *
 * Supabase call that is wrapped in RQuery mutation
 * you can tell its coupled to RQ by the typeScript
 * Promise.
 *
 * Currently set to insert a bid to the bid table and
 * have the default system setting for bid_status set.
 *
 * @param auctionId string
 * @param charityId string
 * @param userId string
 * @param amount number
 * @returns Object
 */
const addBid = async (
  auctionId: string,
  charityId: string,
  userId: string,
  amount: number
): Promise<T_SupabaseBidReturnObject> => {
  try {
    let result;

    result = await supabaseClient
      .from("bid")
      .insert({
        amount: amount,
        auction_id: auctionId,
        bidder_id: userId,
        charity_id: charityId,
        // bid_status: "COMPLETED" // Leave this undefined for default: "PENDING"
      })
      .select()
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      bid: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      bid: [],
      hasError: true,
      rawError: err,
    };
  }
};

/**
 * useAddBidToAuction
 *
 * Wrapper around the Supabase call to update the bid table in the
 * backend.
 *
 * This is a hook wrapping a hook, the mutate method provided by RQuery
 * is responsible for the input types so we use I_SupabaseBidVariables
 * for hard typing the value
 *
 * Note: we call this with mutateAsync. So that we can Await
 * and possibly role back or deal with multistage UI
 *
 * TODO: Check error results and "query states". Also need to verify if
 * we can remove the async/await in the mutationFn as I think they do not
 * do anything.
 *
 * @returns Object
 */
export const useAddBidToBidTable = () => {
  const { isError, isLoading, error, data, mutateAsync } = useMutation({
    mutationFn: async (data: I_SupabaseBidVariables) => {
      return await addBid(
        data.auctionId,
        data.charityId,
        data.userId,
        data.amount
      );
    },
  });

  return [
    {
      queryStatus: {
        isLoading,
        isError,
      },
      bid: data?.bid ?? undefined,
      hasError: data?.hasError || isError ? true : false,
      errorMessage:
        data?.hasError || isError
          ? data?.statusMessage ?? "React Query encountered an error"
          : "",
      errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
    },
    mutateAsync,
  ] as const;
};

const updateBidCompleteStatus = async (
  bidId: string
): Promise<T_SupabaseBidReturnObject> => {
  try {
    let result;

    result = await supabaseClient
      .from("bid")
      .update({ bid_status: "COMPLETE" })
      .eq("bid_id", bidId)
      .select()
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      bid: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      bid: [],
      hasError: true,
      rawError: err,
    };
  }
};

export const useBidStatus = () => {
  const queryClient = useQueryClient();
  const { isError, isLoading, error, data, mutateAsync } = useMutation({
    mutationFn: async (data: I_SupabaseUpdateBidVariables) => {
      return await updateBidCompleteStatus(data.bidId);
    },
    onSettled() {
      // note: on settled is same as "final in try catch" probably need
      // to triple check the result for errors that have been thrown and
      // not caught because of mutateAsync
      queryClient.invalidateQueries({ queryKey: ["auctionQueryResults"] });
    },
  });

  return [
    {
      queryStatus: {
        isLoading,
        isError,
      },
      bid: data?.bid ?? undefined,
      hasError: data?.hasError || isError ? true : false,
      errorMessage:
        data?.hasError || isError
          ? data?.statusMessage ?? "React Query encountered an error"
          : "",
      errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
    },
    mutateAsync,
  ] as const;
};

// UnWrapped methods
// can be wrapped at another time
export const getBidsByAuctionId = async (auctionId: string) => {
  try {
    let result;

    result = await supabaseClient
      .from("bid")
      .select()
      .eq("auction_id", auctionId)
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      bids: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      bids: [],
      hasError: true,
      errorObj: err,
    };
  }
};
