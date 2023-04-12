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

import React, { useEffect, createContext, useContext } from "react";
import useSupabase from "../hooks/useSupabase";

type T_MessageBusProviderProps = {
  children: JSX.Element; // Only accepts FC not class ( basically wrap a single element )
};

type T_Subscriptions = {
  supabase: any
}

type T_MessageBusValues = {
  isInitialized: boolean;
  autoRestart?: boolean; // not used
  subscriptions: T_Subscriptions[] | [] 
};

interface I_MessageBusContext {
  mbus: T_MessageBusValues
}

const MessageBusContext = createContext<I_MessageBusContext | null>(null);

const MessageBusProvider = ({ children }: T_MessageBusProviderProps) => {
  const supabaseClient = useSupabase();

  const mbus: T_MessageBusValues = {
    isInitialized: false,
    subscriptions: []
  };

  useEffect(() => {

    const bidState = supabaseClient
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bid_state" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();
      console.log("[MB - Subscriptions] subscribe tp bid_state changes");

    return () => {
      bidState.unsubscribe();
      console.log("[MB - Subscriptions] unsubscribe from bid_state changes");
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
