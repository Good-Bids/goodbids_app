import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCharityAdmin } from "./useCharityAdmin";
import useSupabase from "./useSupabase";
import { T_NewCharityModel } from "~/utils/types/charities";

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
 * @param charityId string - uuid4 charity Id not null / undefined
 */
const getCharity = async (charityId: string) => {
  try {
    const result = await supabaseClient
      .from("charity")
      .select()
      .eq("charity_id", charityId)
      .limit(1)
      .single()
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      charity: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      charity: undefined,
      hasError: true,
      errorObj: err,
    };
  }
};

/**
 * useCharityQuery
 *
 * ServerSide - false
 *
 * React hook that fetches a single Charity Via
 * createBrowserSupabaseClient wrapped in ReactQuery.
 *
 * React query returns required UI data on top of errors that can
 * be surfaced. Since this is also wrapping the Supabase query and its
 * errors ( can be network or db related etc )
 *
 * Error from ReactQuery is in error
 * Error from SubQuery with Supabase is in data
 *
 * TODO: validate charityId and strip it from possible misuse
 * its passed directly from the address bar into this query
 *
 * return types are inferred
 */
export const useCharityQuery = (charityId?: string | undefined) => {
  // below in temporary - short circuit
  if (charityId === undefined) {
    return {
      queryStatus: {
        isLoading: false,
        isError: false,
      },
      auction: undefined,
      hasError: true,
      errorMessage: "Invalid charity ID",
      errorObj: {
        code: "5000",
        message: "Invalid charity ID",
      },
    } as const;
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["charityQueryResults", charityId],
    queryFn: async () => {
      return await getCharity(charityId);
    },
  });

  return {
    queryStatus: {
      isLoading,
      isError,
    },
    charity: data?.charity ?? undefined,
    hasError: data?.hasError || isError ? true : false,
    errorMessage:
      data?.hasError || isError
        ? data?.statusMessage ?? "React Query encountered an error"
        : "",
    errorObj: data?.hasError || isError ? data?.errorObj ?? error : null,
  } as const;

  /*
  const result = useQuery(["charity", charityId], () => getCharity(charityId), {
    enabled: Boolean(charityId),
  });
  return result;
  */
};

const createCharity = async (data: T_NewCharityModel) => {
  const { data: charityData, error } = await supabaseClient
    .from("charity")
    .insert({ email: data.email, ein: data.ein, name: data.name })
    .select()
    .limit(1)
    .single();

  if (error) {
    throw error;
  } else {
    return charityData;
  }
};

export const useCreateCharity = (
  data: T_NewCharityModel & { adminId: string }
) => {
  return useMutation(() => createCharity(data), {
    onSuccess: async (charityData) => {
      const updateData = updateCharityAdmin(
        charityData.charity_id,
        data.adminId
      );
      return updateData;
    },
  });
};

/**
 * getCharities
 *
 * ServerSide - false
 *
 * Get a collection of Charities. Use Limit and range
 * for pagination and also allow calling based on Status
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
const getCharities = async (
  charityStatus = "ACTIVE",
  windowStart = 0,
  windowLength = 25
) => {
  try {
    let result;

    if (charityStatus === "*") {
      result = await supabaseClient
        .from("charity")
        .select()
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();
    } else {
      result = await supabaseClient
        .from("charity")
        .select()
        .eq("status", charityStatus)
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();
    }

    return {
      status: result.status,
      statusMessage: result.statusText,
      charities: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      charities: [],
      hasError: true,
      errorObj: err,
    };
  }
};

/**
 * useCharitiesQuery
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
export const useCharitiesQuery = (
  charityStatus?: string | undefined,
  windowStart = 0,
  windowLength = 0
) => {
  const [queryParameters, setQueryParameters] = useState({
    charityStatus: charityStatus ?? "*",
    windowStart: 0,
    windowLength: 25,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "auctionCollectionQueryResults",
      queryParameters.charityStatus,
      queryParameters.windowStart,
      queryParameters.windowLength,
    ],
    queryFn: async () => {
      return await getCharities(
        queryParameters.charityStatus,
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
      charities: data?.charities ?? [],
      hasError: data?.hasError || isError ? true : false,
      errorMessage:
        data?.hasError || isError
          ? data?.statusMessage ?? "React Query encountered an error"
          : "",
      errorObj: data?.hasError || isError ? data?.errorObj ?? error : null,
    },
    setQueryParameters,
  ] as const;
};
