import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router"

interface WrapperProps {
  readonly children: React.ReactNode;
};

export const AppLayoutWrapper = ({ children }: WrapperProps) => {

  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const handleLogoutClick = () => {
    () => supabaseClient.auth.signOut()
    router.push('/')
  }

  return (<>
    <div className="flex flex-row p-2 top-0 left-0 right-0 fixed justify-between max-w-screen h-fit-content items-center bg-white">
      <Link href="/">
        <h1 className="text-4xl text-left text-fuchsia-700 font-black">GoodBids</h1>
      </Link>
      {!user ? (
        <Link href="LogIn">
          <p className="text-m text-right font-medium">Sign in</p>
        </Link>
      ) :
        <button onClick={handleLogoutClick}>Sign out</button>}
    </div>
    <main className="flex min-h-screen overflow-auto flex-col items-center justify-center bg-gradient-to-b from-[#00B86B] to-[#EB65CF]">
      {children}
    </main>
  </>)

}