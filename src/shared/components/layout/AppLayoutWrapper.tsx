import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { LogoWithText } from "~/components/LogoWithText";

import { useAdminCheckQuery } from "~/hooks/useCharityAdmin";
import useSupabase from "~/hooks/useSupabase";
import { useUserQuery } from "~/hooks/useUser";

interface WrapperProps {
  readonly children: React.ReactNode;
};

export const AppLayoutWrapper = ({ children }: WrapperProps) => {

  const supabaseClient = useSupabase()
  const { data: user } = useUserQuery()
  const router = useRouter()


  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.reload()
    })
  }

  return (<>
    <div className="flex flex-row p-2 top-0 left-0 right-0 fixed justify-between max-w-screen h-fit-content items-center bg-outerSpace-100">
      <Link href="/">
        <LogoWithText color='#0a3624' showText />
      </Link>
      {!user ? (
        <Link href="/LogIn">
          <p className="text-right text-bottleGreen font-bold">Sign in</p>
        </Link>
      ) :
        <div className="flex flex-row gap-4">
          <button onClick={handleLogoutClick}><span className="text-right text-bottleGreen font-bold">Sign out</span></button>
        </div>
      }
    </div>
    <main className="flex min-h-screen overflow-auto flex-col items-center justify-center">
      {children}
    </main>
  </>)

}