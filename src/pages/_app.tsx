import { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "~/styles/globals.css";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { UserContextProvider } from "~/contexts/UserContextProvider";
import React from "react";
import { useRouter } from "next/router";
import * as ga from '../lib/ga'

const MyApp = ({
  Component,
  pageProps,
}: AppProps) => {

  const router = useRouter();

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

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <QueryClientProvider client={queryClient.current}>
      <UserContextProvider>
        <AppLayoutWrapper>
          <Component {...pageProps} />
        </AppLayoutWrapper>
      </UserContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
