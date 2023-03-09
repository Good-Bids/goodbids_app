import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { checkForAdmin } from "~/features/queries/checkForAdmin";
import { Database } from "~/utils/types/supabase";

const Home: NextPage = () => {

  const user = useUser()
  const supabaseClient = useSupabaseClient<Database>()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [charityId, setCharityId] = useState<string | null>(null)
  const [showCharityCreationLink, setShowCharityCreationLink] = useState(false)

  useEffect(() => {
    checkForAdmin(supabaseClient).then(response => {
      setIsAdmin(response.isCharityAdmin)
      if (!!response.charityId) {
        setCharityId(response.charityId)
        router.push(`/charities[${charityId}]`)
      } else {
        setShowCharityCreationLink(true)
      }
    }
    )
  }, [
    user
  ])


  return (
    <>
      <Head>
        <title>GoodBids</title>
        <meta name="description" content="Donate & Win" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center gap-2">
        {showCharityCreationLink && (
          <>
            <span className="text-black text-7xl font-black">
              Welcome.
            </span>
            <span className="text-black text-xl font-semibold">
              We're glad you're here.
            </span>
            <Link href={"/charities/create"}>
              <span className="text-[#EB65CF] font-bold">
                Register your Charity
              </span>
            </Link>
          </>
        )}
      </div>

    </>
  );
};

export default Home;

