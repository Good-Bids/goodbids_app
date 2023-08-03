import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useSupabase from "~/hooks/useSupabase";
import { useUserQuery } from "~/hooks/useUser";
import { charityColorTailwindString } from "~/utils/constants";

interface WrapperProps {
  readonly children: React.ReactNode;
}

export const AppLayoutWrapper = ({ children }: WrapperProps) => {
  const supabaseClient = useSupabase();
  const { data: user } = useUserQuery();
  const router = useRouter();

  const isIntroPage = router.pathname.includes("intro");
  const prize = router.pathname.includes("watch") ? "watch" : "trek";
  const colorString = charityColorTailwindString["buildOn"];

  const userIsNotSignedIn = user == null;

  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.reload();
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed left-0 right-0 top-0 z-10 flex h-[72px] w-full flex-col items-center shadow">
        <div
          id="appLayoutWrapperHead"
          className="left-0 right-0 top-0 flex h-full w-full flex-row items-center justify-between self-center bg-white px-4 sm:w-full"
        >
          <Link href={`/`} className="flex flex-row gap-2">
            <Image
              src="/buildOnLogo.png"
              alt="buildOn GoodBids Logo"
              width="125"
              height="36"
              priority
            />
          </Link>
          {!isIntroPage && (
            <div className="flex flex-row gap-12 sm:mr-8">
              {userIsNotSignedIn ? (
                <Link href="/login">
                  <p className={`text-right font-bold text-${colorString}`}>
                    Log in
                  </p>
                </Link>
              ) : (
                <button onClick={handleLogoutClick}>
                  <span className={`text-right font-bold text-${colorString}`}>
                    Sign out
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <main
        id="appLayoutWrapperMain"
        className="fixed left-0 right-0 top-[72px] z-0 mx-0 flex h-[calc(100vh_-_72px)] flex-col items-center justify-start self-center overflow-y-auto sm:left-[50%] sm:w-full sm:max-w-[1440px] sm:translate-x-[-50%] sm:px-4"
      >
        {children}
      </main>
      <div
        id="appLayoutWrapperFooter"
        className="absolute bottom-0 flex h-[72px] w-full flex-row items-start justify-between self-start border-t-[1px] border-outerSpace-100 bg-white px-2 py-2 sm:fixed sm:h-fit sm:w-full sm:px-4 sm:py-2"
      >
        <div className="absolute bottom-[-10px] left-[calc(50vw_-_16px)] flex h-fit w-8 items-center justify-center rounded-full border-[1px] border-outerSpace-200 bg-white sm:hidden">
          <p className="text-base font-bold text-outerSpace-500">...</p>
        </div>
        <Link
          href="https://forms.gle/o4Lj8A1NEEAnfjHNA"
          passHref
          target="_blank"
        >
          <div
            className="flex h-fit w-[156px] flex-col 
          gap-1 sm:w-[380px] sm:flex-row sm:items-center sm:gap-0"
          >
            <p className="text-xs text-outerSpace-600">Powered by</p>
            <div className="relative my-[-16px] flex h-12 w-full sm:my-0 sm:h-6 sm:w-[135px]">
              <Image
                src="/logoWithText-bottleGreen.png"
                alt="GoodBids Logo"
                sizes="100%"
                style={{ objectFit: "contain", opacity: "55%" }}
                priority
                fill
              />
            </div>
            <p className="text-xs text-outerSpace-600">Feedback? Questions?</p>
          </div>
        </Link>
        <div className=" h-fit flex-col items-center justify-center sm:flex-row">
          <p className="text-xs text-outerSpace-600 sm:inline">
            © Do You Zoom, Inc.
          </p>
          <Link href="/terms">
            <p className="text-xs text-bo-red sm:inline sm:pl-4">
              Terms of Service
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
