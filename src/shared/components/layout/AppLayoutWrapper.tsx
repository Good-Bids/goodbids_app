import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

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
  const [isAdmin, setIsAdmin] = useState(false)
  const { data: adminData } = useAdminCheckQuery(user?.id)



  useEffect(() => {
    if (adminData) {
      setIsAdmin(() => adminData.isCharityAdmin)
    }
  }, [
    adminData
  ])

  const handleLogoutClick = async () => {
    await supabaseClient.auth.signOut().then(() => {
      router.push('/')
    })
  }

  return (<>
    <div className="flex flex-row p-2 top-0 left-0 right-0 fixed justify-between max-w-screen h-fit-content items-center bg-outerSpace-100">
      <Link href="/">
        <Image src={"/logo-bottleGreen.png"} alt={"GoodBids Logo"} width={211} height={48} />
      </Link>
      {!user ? (
        <Link href="/LogIn">
          <p className="text-right text-bottleGreen font-bold">Sign in</p>
        </Link>
      ) :
        <div className="flex flex-row gap-4">
          <p>{user.email}</p>
          {isAdmin && (
            <Link href="/auctions/create">
              <span className="text-right text-bottleGreen font-bold">
                Create a New Auction
              </span>
            </Link>
          )}
          <button onClick={handleLogoutClick}><span className="text-right text-bottleGreen font-bold">Sign out</span></button>
        </div>
      }
    </div>
    <main className="flex min-h-screen overflow-auto flex-col items-center justify-center">
      {children}
    </main>
  </>)

}