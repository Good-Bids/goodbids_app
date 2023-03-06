import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

interface WrapperProps {
  readonly children: React.ReactNode;
};

export const AppLayoutWrapper = ({ children }: WrapperProps) => {

  const user = useUser()
  const supabaseClient = useSupabaseClient()

  return (<>
    <div className="flex flex-row p-2 justify-between max-w-screen h-fit-content items-center">
      <Link href="/">
        <h1 className="text-4xl text-left text-fuchsia-700 font-black">GoodBids</h1>
      </Link>
      {!user ? (
        <Link href="LogIn">
          <p className="text-m text-right font-medium">Sign in</p>
        </Link>
      ) :
        <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>}
    </div>
    <main className="flex min-h-screen overflow-auto flex-col items-center justify-center bg-gradient-to-b from-[#00B86B] to-[#EB65CF]">
      {children}
    </main>
  </>)

}