import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LogoWithText } from "~/components/LogoWithText";

import { useAdminCheckQuery } from "~/hooks/useCharityAdmin";
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
        className="max-w-screen fixed left-0 right-0 top-0 z-10 flex h-20 flex-row items-center justify-between bg-outerSpace-100 p-2"
      >
        <Link href="/">
          <LogoWithText color="#0a3624" showText />
        </Link>
        {!user ? (
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
        className="min-w-screen fixed top-20 z-0 m-2 flex min-h-screen flex-col items-center justify-start overflow-auto lg:ml-24 lg:mt-20"
      >
        {children}
      </main>
    </>
  );
};
