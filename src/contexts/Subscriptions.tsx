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
import type {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

import { Auction } from "~/utils/types/auctions";
import { useUserQuery } from "~/hooks/useUser";

interface MessageBusProviderProps {
  children: JSX.Element;
}

interface MessageBusValues {
  isInitialized: boolean;
  subscriptions: RealtimeChannel[];
  lastAuctionUpdateMessage?: RealtimePostgresUpdatePayload<Auction> & {
    auction: Auction;
  };
}

interface MessageBusContextArgs {
  messageBus: MessageBusValues;
}

const MessageBusContext = createContext<MessageBusContextArgs | null>(null);

const transformAuctionUpdateMsg = (
  payload: RealtimePostgresUpdatePayload<Auction>
) => {
  return {
    ...payload,
    dateTime: payload.commit_timestamp, // Note: Supabase wrong, its dateTime not timestamp
    errors: payload.errors,
    auction: payload.new, // returns the Auction ROW
    eventType: payload.eventType,
  };
};

const MessageBusProvider = ({ children }: MessageBusProviderProps) => {
  const supabaseClient = useSupabase();

  const [mBus, setMBus] = useState<MessageBusValues>({
    isInitialized: false,
    subscriptions: [],
    lastAuctionUpdateMessage: undefined,
  });

  useEffect(() => {
    const auctionUpdate: RealtimeChannel = supabaseClient
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "auction" },
        (payload: RealtimePostgresUpdatePayload<Auction>) => {
          setMBus({
            ...mBus,
            isInitialized: true,
            lastAuctionUpdateMessage: transformAuctionUpdateMsg(payload),
          });
        }
      )
      .subscribe();

    setMBus((prevState) => {
      return {
        isInitialized: true,
        subscriptions: [auctionUpdate],
        lastMessage: undefined,
        lastAuctionUpdateMessage: undefined,
      };
    });
  }, []);

  return (
    <MessageBusContext.Provider value={{ messageBus: mBus }}>
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
