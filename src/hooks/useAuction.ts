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
        let isValidBid: boolean;
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
            isValidBidAmount =
              bidAmount ===
              auction.data.high_bid_value + auction.data.increment;
            isValidBid = isValidBidAmount;
          } else {
            const sortedBids = auctionBids.data.sort(
              (a, b) =>
                Number(new Date(b.created_at)) - Number(new Date(a.created_at))
            );
            const latestBid = sortedBids[0];
            const latestCompleteBid = sortedBids.find(
              (bid) => bid.bid_status === "COMPLETE"
            );
            const latestBidIsPending = latestBid?.bid_status === "PENDING";
            const latestBidIsNotThisOne = latestBid?.bid_id !== bidId;
            if (latestBidIsPending) {
              if (latestBidIsNotThisOne)
                throw Error(
                  `auction currently has a pending bid - please try again shortly`
                );
            }
            isValidBidAmount =
              bidAmount > Number(latestCompleteBid?.bid_value) &&
              bidAmount ===
                auction.data.high_bid_value + auction.data?.increment;
            isValidBid =
              isValidBidAmount &&
              (!latestBidIsPending ||
                (latestBidIsPending && !latestBidIsNotThisOne));
          }
          if (isValidBid) {
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
      if (bidId) {
        try {
          const cancel = await supabaseClient
            .from("bid")
            .update({ bid_status: "CANCELLED" })
            .eq("bid_id", bidId);
          return { status: cancel.status, bidId };
        } catch (err) {
          throw err;
        }
      }
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

interface Attendance {
  userId: string;
  online_at: string;
  presence_ref?: string;
}

export const useAuctionPresence = (auctionId: string, userId: string) => {
  const thisUserAttendance: Attendance = {
    userId,
    online_at: new Date().toISOString(),
  };
  const [attendance, setAttendance] = useState<Attendance[]>([
    thisUserAttendance,
  ]);
  const auctionChannel = supabaseClient.channel(auctionId);

  const insertUser = async () => await auctionChannel.track(thisUserAttendance);

  if (auctionChannel.joinedOnce) {
    insertUser();
  } else {
    auctionChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // insert current user into attendance
        insertUser();
      }
    });
  }
  auctionChannel.on("presence", { event: "sync" }, () => {
    const state = auctionChannel.presenceState<Attendance>();
    const attendees = Object.entries(state);
    const updatedAttendance: Attendance[] = attendees.map((entry) => ({
      userId: entry[1][0]?.userId ?? "unknown",
      online_at: entry[1][0]?.online_at ?? "unknown",
      presence_ref: entry[1][0]?.presence_ref ?? "unknown",
    }));
    setAttendance(updatedAttendance);
  });
  return attendance;
};
