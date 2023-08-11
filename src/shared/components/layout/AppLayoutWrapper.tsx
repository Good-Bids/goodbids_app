import React, { useState, useEffect } from "react";
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

  const [innerHeight, setInnerHeight] = useState(0);

  const userIsNotSignedIn = user == null;

  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.reload();
    });
  };

  useEffect(() => {
    if (document !== undefined) {
      setInnerHeight(document.body.clientHeight);
    }
  }, []);

  return (
    <div className={`flex h-[calc(100svh)] w-full flex-col`}>
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
                <Link href="/auth-login">
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
        className="fixed left-0 right-0 top-[72px] z-0 mx-0 flex h-[calc(100svh_-_144px)] flex-col items-center justify-start self-center overflow-y-auto sm:left-[50%] sm:w-full sm:max-w-[1440px] sm:translate-x-[-50%] sm:px-4"
      >
        <div className="h-full w-full">{children}</div>
      </main>
      <div
        id="appLayoutWrapperFooter"
        className="fixed bottom-0 flex h-[72px] w-full flex-row items-start justify-between self-start border-t-[1px] border-outerSpace-100 bg-white px-2 py-2 sm:ml-[-16px] sm:h-fit sm:w-[calc(100%_+_32px)] sm:px-6 sm:py-2"
      >
        <Link
          href="https://forms.gle/o4Lj8A1NEEAnfjHNA"
          passHref
          target="_blank"
        >
          <div className="flex h-fit w-[156px] flex-col gap-[6px] sm:w-[380px] sm:flex-row sm:items-center sm:gap-0">
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
            <p className="mt-1 text-xs text-outerSpace-600 sm:mt-0">
              Contact GoodBids
            </p>
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
