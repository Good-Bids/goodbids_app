import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Analytics } from "@vercel/analytics/react";
import * as ga from "../analytics/ga";
import { GoogleAnalyticsScript } from "~/analytics/GoogleAnalyticsScript";

import "~/styles/globals.css";
import "~/styles/chatStyles.css";
// import "~/styles/customChatMessage.scss";

import { UserContextProvider } from "~/contexts/UserContextProvider";
import { MessageBusProvider } from "~/contexts/Subscriptions";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { initialOptions } from "~/utils/constants";

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
            <MessageBusProvider>
              <AppLayoutWrapper>
                <Component {...pageProps} />
              </AppLayoutWrapper>
            </MessageBusProvider>
          </PayPalScriptProvider>
        </UserContextProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
