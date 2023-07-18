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
    <>
      <div
        id="appLayoutWrapperHead"
        className="fixed left-0 right-0 top-0 z-10 flex h-[72px] max-w-[1440px] flex-row items-center justify-between self-center bg-white px-4"
      >
        <Link href={`/${prize}-intro`} className="flex flex-row gap-2">
          <Image
            src="/buildOnLogo.png"
            alt="buildOn GoodBids Logo"
            width="125"
            height="36"
            priority
          />
        </Link>
        {!isIntroPage && (
          <div className="flex flex-row gap-4">
            <Link href={`/${prize}-intro`}>
              <p className={`text-right font-bold text-${colorString}`}>
                About
              </p>
            </Link>
            {userIsNotSignedIn ? (
              <Link href="/LogIn">
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
      <main
        id="appLayoutWrapperMain"
        className="fixed left-0 right-0 top-[72px] z-0 mx-0 flex h-[calc(100vh_-_72px)] max-w-[1440px] flex-col items-center justify-start self-center overflow-y-auto md:px-24 md:pt-20"
      >
        {children}
        <div
          id="appLayoutWrapperFooter"
          className="flex h-[72px] w-full flex-row items-start justify-between self-start px-4 py-4 md:w-[60%]"
        >
          <div
            className="flex h-fit w-[106px] flex-col 
          gap-0 md:w-[300px] md:flex-row md:items-center md:gap-2"
          >
            <p className="text-xs text-outerSpace-600">Powered by</p>
            <div className="relative my-[-16px] flex h-[48px] w-full md:my-0 md:w-[135px]">
              <Image
                src="/logoWithText-bottleGreen.png"
                alt="GoodBids Logo"
                sizes="100%"
                style={{ objectFit: "contain", opacity: "55%" }}
                priority
                fill
              />
            </div>
          </div>
          <div className=" h-fit flex-col items-center justify-center">
            <p className="text-xs text-outerSpace-600">© Do You Zoom, Inc.</p>
            <Link href="/terms">
              <p className="text-xs text-bo-red">Terms of Service</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};
