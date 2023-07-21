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

import { MessageBusProvider } from "~/contexts/Subscriptions";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { auctionTitleImages, initialOptions } from "~/utils/constants";

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

  const prize = router.pathname.includes("watch") ? "watch" : "trek";

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
        <meta
          name="description"
          content="Every bid is a donation, every donation is a bid."
          key="desc"
        />
        <meta property="og:title" content="GoodBids | Auctions for a cause " />
        <meta
          property="og:description"
          content="Every Bid is a donation, every donation is a bid."
        />
        <meta property="og:image" content={`/og-${prize}.png`} />
        <meta property="twitter:image" content={`/og-${prize}.png`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GoogleAnalyticsScript />
      <QueryClientProvider client={queryClient.current}>
        <PayPalScriptProvider options={initialOptions}>
          <MessageBusProvider>
            <AppLayoutWrapper>
              <Component {...pageProps} />
            </AppLayoutWrapper>
          </MessageBusProvider>
        </PayPalScriptProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Analytics />
    </>
  );
};

export default MyApp;
