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

import { useState, useEffect, useRef, createContext, useContext } from "react";
import useSupabase from "../hooks/useSupabase";
import { RealtimeChannel } from "@supabase/supabase-js";

// TODO: fix this
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type T_MessageBusProviderProps = {
  children: JSX.Element; // Only accepts FC not class ( basically wrap a single element )
};

type T_MessageBusValues = {
  isInitialized: boolean;
  subscriptions: RealtimeChannel[];
  lastMessage?: any; // <- RealtimePostgresInsertPayload ???
};

interface I_MessageBusContext {
  mbus: T_MessageBusValues;
}

const MessageBusContext = createContext<I_MessageBusContext | null>(null);

const MessageBusProvider = ({ children }: T_MessageBusProviderProps) => {
  const supabaseClient = useSupabase();

  const [mbus, updateMBus] = useState<T_MessageBusValues>({
    isInitialized: false,
    subscriptions: [],
    lastMessage: undefined,
  });

  // Even Dan A. and the React docs use subscriptions as
  // an example, when in reality its wrong.
  // These things simply are an impedance failure
  // which needs to be external to React.
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
            lastMessage: payload, // RealtimePostgresInsertPayload ???
          });
        }
      )
      .subscribe();

    const bidStateDelete: RealtimeChannel  = supabaseClient
      .channel("custom-delete-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bid_state" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();

    updateMBus((prevState) => {
      return {
        isInitialized: true,
        subscriptions: [bidStateInsert, bidStateDelete],
        lastMessage: undefined,
      };
    });

    // cleanup
    return () => {
      bidStateInsert.unsubscribe();
      bidStateDelete.unsubscribe();
    };
  }, []);

  return (
    <MessageBusContext.Provider value={{ mbus }}>
      {children}
    </MessageBusContext.Provider>
  );
};

const useMessageBus = () => {
  const context = useContext(MessageBusContext);
  if (!context) {
    throw new Error("useMessageBus must be used within a MessageBusProvider");
  }
  return context;
};

export { MessageBusProvider, useMessageBus };
