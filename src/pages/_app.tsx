import { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "~/styles/globals.css";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { UserContextProvider } from "~/contexts/UserContextProvider";
import React from "react";
import { useRouter } from "next/router";
import * as ga from "../lib/ga";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initialOptions } from "~/utils/constants";
import { GoogleAnalyticsScript } from "~/lib/GoogleAnalyticsScript";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
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
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>GoodBids</title>
        <meta name="description" content="Donate & Win" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GoogleAnalyticsScript />
      <QueryClientProvider client={queryClient.current}>
        <UserContextProvider>
          <PayPalScriptProvider options={initialOptions}>
            <AppLayoutWrapper>
              <Component {...pageProps} />
            </AppLayoutWrapper>
          </PayPalScriptProvider>
        </UserContextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
