import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getAuction = async (auctionId?: string) => {
  if (auctionId) {
    const { data, error } = await supabaseClient
      .from("auction")
      .select()
      .eq("auction_id", auctionId)
      .limit(1)
      .single();
    if (error) {
      throw error;
    } else {
      return data;
    }
  }
};

export const useAuctionQuery = (auctionId?: string) => {
  const result = useQuery(["auction", auctionId], () => getAuction(auctionId));
  return result;
};

/**
 * getAuctions
 * 
 * ServerSide - false
 * 
 * Supabase call that fetches Via createBrowserSupabaseClient
 * helper client from @supabase/auth-helpers-nextjs
 * 
 * #note: https://github.com/supabase/postgrest-js/commit/9df1e84750a2d83552d540e711c345b00f3ec1b3
 * from above link - pulling out the returned value and allowing all errors to be surfaced
 *  
 * default supabase limit of 1000 rows so we add defaults
 * 
 * Using temporary mapped error code for inside app errors
 * 5000 - getAuctions undefined error ( no code given by supabase )
 * 
 * @returns Object
 */
const getAuctions = async (windowStart = 0, windowLength = 25) => {

  try {

    const result = await supabaseClient.from("auction")
      .select()
      .range(windowStart, windowLength)
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      auctions: result.data,
      hasError: false,
      rawError: null,
    }

  } catch (err: any) {

    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      auctions: [],
      hasError: true,
      errorObj: err,
    }

  }

};

/**
 * useAuctionQuery
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
 * @returns Object
 */
export const useAuctionsQuery = (): any => {

  const [dataWindow, setDataWindow] = React.useState({
    windowStart: 0,
    windowLength: 25,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['auctionCollectionQueryResults', dataWindow.windowStart, dataWindow.windowLength],
    queryFn: async () => {
      return await getAuctions(dataWindow.windowStart, dataWindow.windowLength);
    }
  });

  // Normalize return Data depending on request level
  let returnObj = {};
  
  if(data?.hasError || isError) {
    returnObj = {
      queryStatus: {
        isLoading,
        isError
      },
      auctions: [],
      hasError: true,
      errorMessage: data?.statusMessage ?? "React Query encountered an error",
      errorObj: data?.errorObj ?? error
    };
  } else {
    returnObj = {
      queryStatus: {
        isLoading,
        isError
      },
      auctions: data?.auctions ?? [],
      hasError: false,
      errorMessage: "",
      errorObj: null
    };
  }

  return [
    returnObj,
    setDataWindow
  ]
};