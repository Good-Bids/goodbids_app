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

import React, { createContext, useContext } from "react";
import useSupabase from "../hooks/useSupabase";

type T_MessageBusProviderProps = {
  children: JSX.Element; // Only accepts FC not class ( basically wrap a single element )
};

type T_MessageBusOptions = {
  isInitialized: boolean,
  autoRestart?: boolean // not used
};

interface I_MessageBusContext {
  options: T_MessageBusOptions;
}

const MessageBusContext = createContext<I_MessageBusContext | null>(null);

const MessageBusProvider = ({ children }: T_MessageBusProviderProps) => {

  const options: T_MessageBusOptions = {
    isInitialized: false,
  };

  return (
    <MessageBusContext.Provider value={{options}}>
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
