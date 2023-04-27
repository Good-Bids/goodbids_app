import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { Auction } from "~/utils/types/auctions";

const supabaseClient = useSupabase();

interface SupabaseAuctionReturnObject {
  status: number;
  statusMessage: string;
  auction: any;
  hasError: boolean;
  rawError: any | null;
}

export const updateAuctionStatus = async (
  auctionId: string,
  status: string
): Promise<SupabaseAuctionReturnObject> => {
  try {
    const result = await supabaseClient
      .from("auction")
      .update({ status })
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
export const getAuction = async (auctionId: string) => {
  try {
    const result = await supabaseClient
      .from("auction")
      .select("*")
      .eq("auction_id", auctionId)
      .limit(1)
      .single()
      .throwOnError();

    return result.data;
  } catch (err) {
    throw err;
  }
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
const getAuctions = async (args: {
  auctionStatus: string;
  charityId?: string;
  windowStart: number;
  windowLength: number;
}) => {
  const { auctionStatus, charityId, windowLength, windowStart } = args;
  try {
    if (charityId) {
      const result = await supabaseClient
        .from("auction")
        .select("*")
        .eq("status", auctionStatus)
        .eq("charity_id", charityId)
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();

      return result;
    } else {
      const result = await supabaseClient
        .from("auction")
        .select("*")
        .eq("status", auctionStatus)
        .order("created_at", { ascending: false }) // Gets latest on top by creation date
        .range(windowStart, windowLength)
        .throwOnError();

      return result;
    }
  } catch (err: any) {
    throw err;
  }
};

const getBidsByAuction = async (auctionId: string) => {
  try {
    const result = await supabaseClient
      .from("bid")
      .select("*")
      .eq("auction_id", auctionId)
      .order("created_at", { ascending: false });
    return result.data;
  } catch (err) {
    throw err;
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
export const useAuctionQuery = (auctionId: string) => {
  const result = useQuery({
    queryKey: ["auctionQueryResults", auctionId],
    queryFn: async () => {
      return await getAuction(auctionId);
    },
    enabled: auctionId !== "",
  });

  return result;
};

export const useBidsByAuction = (auctionId: string) => {
  const result = useQuery({
    queryKey: ["bidsByAuction", auctionId],
    queryFn: async () => {
      return await getBidsByAuction(auctionId);
    },
    enabled: auctionId !== "",
  });

  return result;
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
export const useAuctionsQuery = (args: {
  auctionStatus?: string;
  charityId?: string;
  windowStart?: number;
  windowLength?: number;
}) => {
  const { auctionStatus, charityId, windowStart, windowLength } = args;
  const [queryParameters, setQueryParameters] = useState({
    auctionStatus: auctionStatus ?? "ACTIVE",
    charityId: charityId,
    windowStart: windowStart ?? 0,
    windowLength: windowLength ?? 25,
  });

  const result = useQuery({
    queryKey: [
      "auctionCollectionQueryResults",
      queryParameters.auctionStatus,
      queryParameters.charityId,
      queryParameters.windowStart,
      queryParameters.windowLength,
    ],
    queryFn: async () => await getAuctions(queryParameters),
  });

  return { ...result, data: result.data?.data };
};

export const updateBidTable = async (args: {
  auctionId: string;
  userId: string;
  bidAmount: number;
  bidState: "PENDING" | "CANCELLED" | "COMPLETE";
  bidId?: string;
}) => {
  const { auctionId, userId, bidAmount, bidState, bidId } = args;
  switch (bidState) {
    case "PENDING": {
      console.log("insert!");
      try {
        let isValidBidAmount: boolean;
        const auctionBids = await supabaseClient
          .from("bid")
          .select("*")
          .eq("auction_id", auctionId)
          .order("bid_value", { ascending: false });
        const auction = await supabaseClient
          .from("auction")
          .select("*")
          .eq("auction_id", auctionId)
          .single();

        if (auctionBids.data && auction.data) {
          const isFirstBid = auctionBids.data.length == 0;
          const bidId = crypto.randomUUID();
          if (isFirstBid) {
            console.log("first bid!");
            isValidBidAmount =
              bidAmount ===
              auction.data.high_bid_value + auction.data.increment;
          } else {
            console.log("nth bid!");
            const sortedBids = auctionBids.data.sort(
              (a, b) =>
                Number(new Date(b.created_at)) - Number(new Date(a.created_at))
            );
            const latestBid = sortedBids[0];
            const latestBidIsComplete = latestBid?.bid_status === "COMPLETE";
            if (!latestBidIsComplete) {
              throw Error(
                `auction currently has a pending bid - please try again shortly`
              );
            }
            isValidBidAmount =
              latestBidIsComplete &&
              bidAmount > Number(latestBid?.bid_value) &&
              bidAmount ===
                auction.data.high_bid_value + auction.data?.increment;
          }
          if (isValidBidAmount) {
            console.log("valid amount!");
            const insert = await supabaseClient.from("bid").insert({
              bid_value: bidAmount,
              auction_id: auctionId,
              bid_status: "PENDING",
              bidder_id: userId,
              charity_id: auction.data.charity_id,
              bid_id: bidId,
            });
            if (insert.status == 201) {
              return { ...insert, bidId };
            }
          } else throw Error("Invalid Bid Amount - please try again");
        } else throw Error(`Could not retrieve data for auction ${auctionId}`);
      } catch (err) {
        throw err;
      }
    }
    case "COMPLETE": {
      console.log("update!");
      if (bidId) {
        try {
          const update = await supabaseClient
            .from("bid")
            .update({ bid_status: "COMPLETE" })
            .eq("bid_id", bidId);
          return { status: update.status, bidId };
        } catch (err) {
          throw err;
        }
      }
    }
    case "CANCELLED": {
      if (bidId) return { status: 200, bidId };
    }
  }
};

export const useBidMutation = (args: {
  auctionId: string;
  userId: string;
  bidAmount: number;
  bidState: "PENDING" | "CANCELLED" | "COMPLETE";
  bidId?: string;
}) => {
  const { auctionId, userId, bidAmount, bidState, bidId } = args;
  const bidMutation = useMutation({
    mutationKey: ["updateBid", `${auctionId}_${userId}_${bidAmount}_${bidId}`],
    mutationFn: async () =>
      await updateBidTable({ auctionId, userId, bidAmount, bidState, bidId }),
  });
  return bidMutation;
};

// -- THE LINE -- everything under this line is currently unused

// /**
//  * preflightValidateBidAmount
//  *
//  * check to see if the DB currentBidValue + increment value
//  * will be larger than the newBidValue. If it is then something
//  * is wrong and a race condition was hit
//  * Also: would be better to validate against the next increment
//  * to ensure amount is matched correctly
//  *
//  * async
//  *
//  * @param auctionId string
//  * @param bidIncrement number
//  * @param newBidValue number
//  * @returns object
//  */
// export const preflightValidateBidAmount = async (
//   auctionId: string,
//   bidIncrement: number,
//   newBidValue: number
// ) => {
//   try {
//     let isValidBidAmount = false;

//     const result = await supabaseClient
//       .from("auction")
//       .select("high_bid_value")
//       .eq("auction_id", auctionId)
//       .limit(1)
//       .throwOnError();

//     if (result.data !== null) {
//       if (result.data[0] !== undefined) {
//         const currentBidValue = result.data[0].high_bid_value ?? 0;
//         if (currentBidValue + bidIncrement <= newBidValue) {
//           isValidBidAmount = true;
//         }
//       }
//     }

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bidAmountValid: isValidBidAmount,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bidAmountValid: false,
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * updateAuctionWithBid
//  *
//  * Note: Supabase v2 api calls do not hydrate a new model
//  * they return a 204 after the patch is called. This is opposite
//  * from v1. So v2 supports getting the return updated object
//  * via a second select.
//  *
//  * async
//  *
//  * @param auctionId string
//  * @param newBidValue number
//  * @returns object
//  */
// export const updateAuctionWithBid = async (
//   auctionId: string,
//   newBidValue: number
// ): Promise<SupabaseAuctionReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("auction")
//       .update({ high_bid_value: newBidValue })
//       .eq("auction_id", auctionId)
//       .select(
//         `
//           *,
//           bids: bid(*)
//         `
//       )
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       auction: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       auction: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * addBid
//  *
//  * Supabase call that is wrapped in RQuery mutation
//  * you can tell its coupled to RQ by the typeScript
//  * Promise.
//  *
//  * Currently set to insert a bid to the bid table and
//  * have the default system setting for bid_status set.
//  *
//  * @param auctionId string
//  * @param charityId string
//  * @param userId string
//  * @param amount number
//  * @returns Object
//  */
// export const addBid = async (
//   auctionId: string,
//   charityId: string,
//   userId: string,
//   amount: number
// ): Promise<SupabaseBidReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("bid")
//       .insert({
//         bid_value: amount,
//         auction_id: auctionId,
//         bidder_id: userId,
//         charity_id: charityId,
//         // bid_status: "COMPLETED" // Leave this undefined for default: "PENDING"
//       })
//       .select()
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bid: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bid: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * useAddBidToAuction
//  *
//  * Wrapper around the Supabase call to update the bid table in the
//  * backend.
//  *
//  * This is a hook wrapping a hook, the mutate method provided by RQuery
//  * is responsible for the input types so we use I_SupabaseBidVariables
//  * for hard typing the value
//  *
//  * Note: we call this with mutateAsync. So that we can Await
//  * and possibly role back or deal with multistage UI
//  *
//  * TODO: Check error results and "query states". Also need to verify if
//  * we can remove the async/await in the mutationFn as I think they do not
//  * do anything.
//  *
//  * @returns Object
//  */
// export const useAddBidToBidTable = () => {
//   const { isError, isLoading, error, data, mutateAsync } = useMutation({
//     mutationFn: async (data: SupabaseBidVariables) => {
//       return await addBid(
//         data.auctionId,
//         data.charityId,
//         data.userId,
//         data.amount
//       );
//     },
//   });

//   return [
//     {
//       queryStatus: {
//         isLoading,
//         isError,
//       },
//       bid: data?.bid ?? undefined,
//       hasError: !!(data?.hasError || isError),
//       errorMessage:
//         data?.hasError || isError
//           ? data?.statusMessage ?? "React Query encountered an error"
//           : "",
//       errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
//     },
//     mutateAsync,
//   ] as const;
// };

// /**
//  * updateBidCompleteStatus
//  *
//  * Simple direct call to change the status col in the bid
//  * table to "COMPLETE"
//  *
//  * @param bidId string
//  */
// export const updateBidCompleteStatus = async (
//   bidId: string
// ): Promise<SupabaseBidReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("bid")
//       .update({ bid_status: "COMPLETE" })
//       .eq("bid_id", bidId)
//       .select()
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bid: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bid: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * useBidStatus
//  *
//  * ReactQuery wrapper that uses mutateAsync to update the
//  * bid table. Because this wraps the updateBidComplete status
//  * the function also triggers the auto update of the
//  * auction values as it assumes that the bid went through
//  *
//  * Note: the required value of bidId is passed in from the hook's
//  * update method in the component
//  *
//  */
// export const useBidStatus = () => {
//   const queryClient = useQueryClient();
//   const { isError, isLoading, error, data, mutateAsync } = useMutation({
//     mutationFn: async (data: I_SupabaseUpdateBidVariables) => {
//       return await updateBidCompleteStatus(data.bidId);
//     },
//     onSettled: async () => {
//       // note: on settled is same as "final in try catch" probably need
//       // to triple check the result for errors that have been thrown and
//       // not caught because of mutateAsync
//       await queryClient.invalidateQueries({
//         queryKey: ["auctionQueryResults"],
//       });
//     },
//   });

//   return [
//     {
//       queryStatus: {
//         isLoading,
//         isError,
//       },
//       bid: data?.bid ?? undefined,
//       hasError: !!(data?.hasError || isError),
//       errorMessage:
//         data?.hasError || isError
//           ? data?.statusMessage ?? "React Query encountered an error"
//           : "",
//       errorObj: data?.hasError || isError ? data?.rawError ?? error : null,
//     },
//     mutateAsync,
//   ] as const;
// };

// /**
//  * addBidLock
//  *
//  * When the paypal button is clicked it registers
//  * intent to bid. We then lock the bidding for this
//  * auction with its auction_id. The lock is removed
//  * with the removeBidLockByAuctionId method and
//  * both these calls trigger the Supabase DB change
//  * messages for all connected clients
//  *
//  * @param auctionId string
//  */
// export const addBidLock = async (
//   auctionId: string
// ): Promise<SupabaseBidStatusReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("bid_state")
//       .insert({
//         auction_id: auctionId,
//       })
//       .select()
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bidStatus: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bidStatus: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * removeBidLockByAuctionId
//  *
//  * see addBid method call for details
//  *
//  * @param auctionId string
//  */
// export const removeBidLockByAuctionId = async (
//   auctionId: string
// ): Promise<SupabaseBidStatusReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("bid_state")
//       .delete()
//       .eq("auction_id", auctionId)
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bidStatus: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bidStatus: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * checkIsBidLocked
//  *
//  * When a user goes to a specific auction page
//  * there is a possibility that the auction can have
//  * a bid that is underway. This call can check onLoad
//  * so that the UI can display or disable the bid
//  * UI.
//  *
//  * @param auctionId string
//  */
// export const checkIsBidLocked = async (
//   auctionId: string
// ): Promise<SupabaseBidStatusReturnObject> => {
//   try {
//     const result = await supabaseClient
//       .from("bid_state")
//       .select()
//       .eq("auction_id", auctionId)
//       .throwOnError();

//     return {
//       status: result.status,
//       statusMessage: result.statusText,
//       bidStatus: result.data,
//       hasError: false,
//       rawError: null,
//     };
//   } catch (err: any) {
//     return {
//       status: err?.code ?? "5000",
//       statusMessage: err?.message ?? "unknown error type",
//       bidStatus: [],
//       hasError: true,
//       rawError: err,
//     };
//   }
// };

// /**
//  * useUpdateAuctionCache
//  *
//  * Used to manually trigger a reload of the
//  * current auction displayed. For after a bid
//  * or failure of a bid.
//  */
// export const useUpdateAuctionCache = () => {
//   const queryClient = useQueryClient();

//   const update = async () => {
//     await queryClient.invalidateQueries({ queryKey: ["auctionQueryResults"] });
//   };

//   return update;
// };

// /**
//  * useUpdateAuctionCollectionCache
//  *
//  * Used to manually trigger a reload of the
//  * current auction collection.
//  *
//  * Note: when refreshing this, need to be careful
//  * of the current paginated range values.
//  */
// export const useUpdateAuctionCollectionCache = () => {
//   const queryClient = useQueryClient();

//   const update = async () => {
//     await queryClient.invalidateQueries({
//       queryKey: ["auctionCollectionQueryResults"],
//     });
//   };

//   return update;
// };
