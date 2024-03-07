import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalyticsScript } from "~/analytics/GoogleAnalyticsScript";

import "~/styles/globals.css";

import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>GoodBids</title>
        <meta
          name="description"
          content="Every bid is a donation, every donation is a bid."
          key="desc"
        />
        <meta
          name="facebook-domain-verification"
          content="fyp3n1kepkxgs80hrgwfktmrzi9csv"
        />
        <meta property="og:title" content="GoodBids | Auctions for a cause " />
        <meta
          property="og:description"
          content="Every Bid is a donation, every donation is a bid."
        />
        <meta property="og:image" content="/opengraph-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="//code.tidio.co/jriiol70hzu4hmkhyj068znnil9bptma.js"
          async
        ></script>
      </Head>
      <GoogleAnalyticsScript />
      <AppLayoutWrapper>
        <Component {...pageProps} />
      </AppLayoutWrapper>
      <Analytics />
    </>
  );
};

export default MyApp;
