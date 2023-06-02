/**
 *
 * useMyAuctions - hooks and Supabase calls
 *
 * auction table has auction_id & charity_id
 * charity_admin_id table has user_id & charity_id & charity_admin_id
 *
 * user_id and charity_admin_id are the same.... so ???
 *
 * There is a field for is_charity_admin as a bool TRUE:FALSE but this raises
 * some serious complexity regarding what the table means. Users not an admin
 * of a charity and thereby - all its auctions - should not be in this table.
 *
 * in simple terms it should just have a rows for:
 * created_at(PK), charity_id(FK), user_id(FK)
 * means this table is simply just for relationships/state holding
 *
 * for this sprint we will ignore some of the fields and just make sure we can
 * get auctions by user_id using the charity_id for fetching from the auction table
 *
 *
 *
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

type SupabaseAdminReturnObject = {
  status: number;
  statusMessage: string;
  charityIdCollection: any;
  hasError: boolean;
  rawError: any | null;
};

/**
 * getCharityUserAdministers
 *
 * gets a list of charities that a userId is associated with
 * for administration. If it returns 0, then this userId is not
 * the admin of anything.
 *
 * @param userId string - users auth id from the JWT
 */
const getCharityUserAdministers = async (
  userId: string
): Promise<SupabaseAdminReturnObject> => {
  try {
    let result;

    result = await supabaseClient
      .from("charity_admin")
      .select()
      .eq("user_id", userId)
      .eq("is_charity_admin", true) // Note if table is fixed can remove this check
      .throwOnError();

    return {
      status: result.status,
      statusMessage: result.statusText,
      charityIdCollection: result.data,
      hasError: false,
      rawError: null,
    };
  } catch (err: any) {
    return {
      status: err?.code ?? "5000",
      statusMessage: err?.message ?? "unknown error type",
      charityIdCollection: [],
      hasError: true,
      rawError: err,
    };
  }
};

const getMyAuctions = async (
  userId: string,
  windowStart = 0,
  windowLength = 25
) => {
  // check first to see if the user administers any charities
  let checkAdminResults = await getCharityUserAdministers(userId);

  // Does not admin anything
  if (checkAdminResults.hasError) {
    return {
      status: checkAdminResults.status,
      statusMessage: checkAdminResults.statusMessage,
      auctions: [],
      hasError: false,
      rawError: checkAdminResults.rawError,
    };
  }

  // Does not admin anything
  if (checkAdminResults.charityIdCollection.length === 0) {
    return {
      status: 404,
      statusMessage: "User is not an admin of any charity",
      auctions: [],
      hasError: false,
      rawError: null,
    };
  }

  // For now we will be assuming the spec only 1 charity_id
  const charity_id = checkAdminResults.charityIdCollection[0].charity_id;

  try {
    let result;

    result = await supabaseClient
      .from("auction")
      .select(
        `
          *,
          bids: bid(*)
        `
      )
      // .returns<I_AuctionModel>()
      .eq("charity_id", charity_id)
      .order("created_at", { ascending: false }) // Gets latest on top by creation date
      .range(windowStart, windowLength)
      .throwOnError();

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

export const useMyAuctionsQuery = (
  userId: string,
  windowStart = 0,
  windowLength = 0
) => {
  const [queryParameters, setQueryParameters] = useState({
    userId: userId,
    windowStart: 0,
    windowLength: 25,
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "myAuctionCollectionQueryResults",
      queryParameters.userId,
      queryParameters.windowStart,
      queryParameters.windowLength,
    ],
    queryFn: async () => {
      return await getMyAuctions(
        queryParameters.userId,
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
