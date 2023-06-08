import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LogoWithText } from "~/components/LogoWithText";

import useSupabase from "~/hooks/useSupabase";
import { useUserQuery } from "~/hooks/useUser";

interface WrapperProps {
  readonly children: React.ReactNode;
}

export const AppLayoutWrapper = ({ children }: WrapperProps) => {
  const supabaseClient = useSupabase();
  const { data: user } = useUserQuery();
  const router = useRouter();

  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.reload();
    });
  };

  return (
    <>
      <div
        id="appLayoutWrapperHead"
        className="fixed left-0 right-0 top-0 z-10 flex h-20 flex-row items-center justify-between bg-outerSpace-100 p-2"
      >
        <Link href="/">
          <p className="text-2xl font-black">ACME co. auctions</p>
        </Link>
        {user == null ? (
          <Link href="/LogIn">
            <p className="text-right font-bold text-bottleGreen">Sign in</p>
          </Link>
        ) : (
          <div className="flex flex-row gap-4">
            <button onClick={handleLogoutClick}>
              <span className="text-right font-bold text-bottleGreen">
                Sign out
              </span>
            </button>
          </div>
        )}
      </div>
      <main
        id="appLayoutWrapperMain"
        className="fixed left-0 right-0 top-20 z-0 m-2 flex h-[calc(100vh_-_6rem)] flex-col items-center justify-start overflow-y-auto md:px-24 md:py-20"
      >
        {children}
      </main>
    </>
  );
};
