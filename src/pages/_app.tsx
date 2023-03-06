import { AppProps } from "next/app";
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'

import "~/styles/globals.css";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";
import { supabase } from "~/server/api/supabase";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { env } from "~/env.mjs";

const MyApp = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) => {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient({ supabaseUrl: "https://imjsqwufoypzctthvxmr.supabase.co", supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltanNxd3Vmb3lwemN0dGh2eG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc3ODI2NzAsImV4cCI6MTk5MzM1ODY3MH0.ucm5n-RtU1gmOvk6J5oRWRej5fOVeJFgXLknE6vxpJ4" }))

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}>
      <AppLayoutWrapper>
        <Component {...pageProps} />
      </AppLayoutWrapper>
    </SessionContextProvider>
  );
};

export default MyApp;
