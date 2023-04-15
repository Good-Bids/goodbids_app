/**
 * Subscriptions
 *
 * This file provides a Context for initialization
 * and a Hook for general usage
 *
 * Subscriptions match to Supabase's concept of
 * "realtime" table based onChange events.
 *
 */

import React, { useState, useEffect, createContext, useContext } from "react";
import useSupabase from "../hooks/useSupabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

// TODO: fix this
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface MessageBusProviderProps {
  children: JSX.Element; // Only accepts FC not class ( basically wrap a single element )
}

interface MessageBusValues {
  isInitialized: boolean;
  subscriptions: RealtimeChannel[];
  lastBidLockMessage?: RealtimePostgresChangesPayload<>;
  lastAuctionUpdateMessage?: any;
}

interface MessageBusContextArgs {
  messageBus: MessageBusValues;
}

const MessageBusContext = createContext<MessageBusContextArgs | null>(null);

// Should be -> RealtimePostgresInsertPayload
const transformBidLockInsertMsg = (payload: any) => {
  return {
    dateTime: payload.commit_timestamp, // Note: Supabase wrong, its dateTime not timestamp
    errors: payload.errors,
    ttl: payload.new.ttl,
    auctionId: payload.new.auction_id,
    eventType: payload.eventType,
  };
};

// Should be -> RealtimePostgresUpdatePayload
const transformBidLockDeleteMsg = (payload: any) => {
  return {
    dateTime: payload.commit_timestamp, // Note: Supabase wrong, its dateTime not timestamp
    errors: payload.errors,
    ttl: payload.new.ttl,
    auctionId: payload.old.auction_id,
    eventType: payload.eventType,
  };
};

const transformAuctionUpdateMsg = (payload: any) => {
  return {
    dateTime: payload.commit_timestamp, // Note: Supabase wrong, its dateTime not timestamp
    errors: payload.errors,
    auction: payload.new, // returns the Auction ROW
    eventType: payload.eventType,
  };
};

const MessageBusProvider = ({ children }: MessageBusProviderProps) => {
  const supabaseClient = useSupabase();

  const [mbus, updateMBus] = useState<MessageBusValues>({
    isInitialized: false,
    subscriptions: [],
    lastBidLockMessage: undefined,
    lastAuctionUpdateMessage: undefined,
  });

  useEffect(() => {
    const bidStateInsert: RealtimeChannel = supabaseClient
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bid_state" },
        (payload) => {
          // RaceCondition between Callback and state
          updateMBus({
            ...mbus,
            isInitialized: true,
            lastBidLockMessage: transformBidLockInsertMsg(payload),
          });
        }
      )
      .subscribe();

    const bidStateDelete: RealtimeChannel = supabaseClient
      .channel("custom-delete-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bid_state" },
        (payload) => {
          // RaceCondition between Callback and state
          updateMBus({
            ...mbus,
            isInitialized: true,
            lastBidLockMessage: transformBidLockDeleteMsg(payload),
          });
        }
      )
      .subscribe();

    const auctionUpdate: RealtimeChannel = supabaseClient
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "auction" },
        (payload) => {
          // transformAuctionUpdateMsg
          updateMBus({
            ...mbus,
            isInitialized: true,
            lastAuctionUpdateMessage: transformAuctionUpdateMsg(payload),
          });
        }
      )
      .subscribe();

    updateMBus((prevState) => {
      return {
        isInitialized: true,
        subscriptions: [bidStateInsert, bidStateDelete, auctionUpdate],
        lastMessage: undefined,
        lastAuctionUpdateMessage: undefined,
      };
    });

    // cleanup
    return async () => {
      await bidStateInsert.unsubscribe();
      await bidStateDelete.unsubscribe();
      await auctionUpdate.unsubscribe();
    };
  }, []);

  return (
    <MessageBusContext.Provider value={{ messageBus: mbus }}>
      {children}
    </MessageBusContext.Provider>
  );
};

const useMessageBus = () => {
  const context = useContext(MessageBusContext);
  if (context == null) {
    throw new Error("useMessageBus must be used within a MessageBusProvider");
  }
  return context;
};

export { MessageBusProvider, useMessageBus };
