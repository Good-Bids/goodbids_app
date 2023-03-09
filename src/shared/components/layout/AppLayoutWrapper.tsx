import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { checkForAdmin } from "~/features/queries/checkForAdmin";
import { Database } from "~/utils/types/supabase";

interface WrapperProps {
  readonly children: React.ReactNode;
};

export const AppLayoutWrapper = ({ children }: WrapperProps) => {

  const user = useUser()
  const supabaseClient = useSupabaseClient<Database>()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    checkForAdmin(supabaseClient).then(response =>
      setIsAdmin(() =>
        response.isCharityAdmin
      )
    )
  }, [
    user
  ])

  const handleLogoutClick = () => {
    supabaseClient.auth.signOut()
    router.push('/')
  }

  return (<>
    <div className="flex flex-row p-2 top-0 left-0 right-0 fixed justify-between max-w-screen h-fit-content items-center bg-white  bg-gradient-to-r to-[#00B86B] from-[#EB65CF]">
      <Link href="/">
        <h1 className="text-4xl text-left text-white font-black">GoodBids</h1>
      </Link>
      {!user ? (
        <Link href="/LogIn">
          <p className="text-right text-white font-bold">Sign in</p>
        </Link>
      ) :
        <div className="flex flex-row gap-4">
          <p>{user.email}</p>
          {isAdmin && (
            <Link href="/auctions/create">
              <span className="text-right text-white font-bold">
                Create a New Auction
              </span>
            </Link>
          )}
          <button onClick={handleLogoutClick}><span className="text-right text-white font-bold">Sign out</span></button>
        </div>
      }
    </div>
    <main className="flex min-h-screen overflow-auto flex-col items-center justify-center">
      {children}
    </main>
  </>)

}