import React from "react";
import Image from "next/image";
import Link from "next/link";

interface WrapperProps {
  readonly children: React.ReactNode;
}

export const AppLayoutWrapper = ({ children }: WrapperProps) => {
  return (
    <div className={`flex h-[calc(100svh)] w-full flex-col`}>
      <div className="fixed left-0 right-0 top-0 z-10 flex h-[72px] w-full flex-col items-center shadow">
        <div
          id="appLayoutWrapperHead"
          className="left-0 right-0 top-0 flex h-full w-full flex-row items-center justify-between self-center bg-white px-4 sm:w-full"
        >
          <Link href={`/`} className="flex flex-row gap-2">
            <Image
              src="/logoWithText-bottleGreen.png"
              alt="GoodBids Logo"
              width="200"
              height="48"
              priority
            />
          </Link>
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
        className="fixed bottom-0 flex h-[72px] w-full flex-row items-center border-t-[1px] border-outerSpace-100 bg-white px-2 py-2 sm:ml-[-16px] sm:h-fit sm:px-6 sm:py-2"
      >
        <p className="sm:inlinem w-fit text-xs text-outerSpace-600">
          © Do You Zoom, Inc.
        </p>
      </div>
    </div>
  );
};
