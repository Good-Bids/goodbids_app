import { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

import "~/styles/globals.css";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { UserContextProvider } from "~/contexts/UserContextProvider";
import React from "react";

const MyApp = ({
  Component,
  pageProps,
}: AppProps) => {


  const queryClient = React.useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          retry: false,
          staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient.current}>
      <UserContextProvider>
        <AppLayoutWrapper>
          <Component {...pageProps} />
        </AppLayoutWrapper>
      </UserContextProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default MyApp;
