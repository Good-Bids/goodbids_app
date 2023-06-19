import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useSupabase from "~/hooks/useSupabase";
import { useUserQuery } from "~/hooks/useUser";

interface WrapperProps {
  readonly children: React.ReactNode;
}

export const AppLayoutWrapper = ({ children }: WrapperProps) => {
  const supabaseClient = useSupabase();
  const { data: user } = useUserQuery();
  const router = useRouter();

  const isIntroPage = router.pathname.includes("intro");

  const userIsNotSignedIn = user == null;

  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.reload();
    });
  };

  return (
    <>
      <div
        id="appLayoutWrapperHead"
        className="fixed left-0 right-0 top-0 z-10 flex h-[72px] flex-row items-center justify-between bg-white px-4"
      >
        <Link href="/">
          <Image
            src="/charityWaterLogo.png"
            alt="Charity Water Logo"
            width="165"
            height="36"
          />
        </Link>
        {!isIntroPage && (
          <div className="flex flex-row gap-4">
            <Link href="/intro">
              <p className="text-right font-bold text-cw-blue">About</p>
            </Link>
            {userIsNotSignedIn ? (
              <Link href="/LogIn">
                <p className="text-right font-bold text-cw-blue">Log in</p>
              </Link>
            ) : (
              <button onClick={handleLogoutClick}>
                <span className="text-right font-bold text-cw-blue">
                  Sign out
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      <main
        id="appLayoutWrapperMain"
        className="fixed left-0 right-0 top-[72px] z-0 mx-0 flex h-[calc(100vh_-_72px)] flex-col items-center justify-start overflow-y-auto md:px-24 md:py-20"
      >
        {children}
      </main>
    </>
  );
};
