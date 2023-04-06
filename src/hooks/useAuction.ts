import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
const supabaseClient = useSupabase();

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
      .select()
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
    }

  } catch (err: any) {

    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      auction: undefined,
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
  if(auctionId === undefined) {
    return (
      {
        queryStatus: {
          isLoading: false,
          isError: false
        },
        auction: undefined,
        hasError: true,
        errorMessage: "Invalid auction ID",
        errorObj: {
          code: "5000",
          message: "Invalid auction ID"
        }
      }
    ) as const
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['auctionQueryResults', auctionId],
    queryFn: async () => {
      return await getAuction(auctionId);
    }
  });

  return (
    {
      queryStatus: {
        isLoading,
        isError
      },
      auction: data?.auction ?? undefined,
      hasError: (data?.hasError || isError) ? true : false,
      errorMessage: (data?.hasError || isError) ? data?.statusMessage ?? "React Query encountered an error" : "",
      errorObj: (data?.hasError || isError) ? data?.errorObj ?? error : null
    }
  ) as const
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
 * Types are inferred from supabase DB <database>
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
export const useAuctionsQuery = () => {

  const [dataWindow, setDataWindow] = useState({
    windowStart: 0,
    windowLength: 25,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['auctionCollectionQueryResults', dataWindow.windowStart, dataWindow.windowLength],
    queryFn: async () => {
      return await getAuctions(dataWindow.windowStart, dataWindow.windowLength);
    }
  });

  return [
    {
      queryStatus: {
        isLoading,
        isError
      },
      auctions: data?.auctions ?? [],
      hasError: (data?.hasError || isError) ? true : false,
      errorMessage: (data?.hasError || isError) ? data?.statusMessage ?? "React Query encountered an error" : "",
      errorObj: (data?.hasError || isError) ? data?.errorObj ?? error : null
    },
    setDataWindow
  ] as const
};