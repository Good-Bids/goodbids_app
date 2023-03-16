import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAdminCheckQuery } from "~/hooks/useCharityAdmin";
import { useUserQuery } from "~/hooks/useUser";

const Home: NextPage = () => {

  const user = useUserQuery()
  const router = useRouter()
  const [showCharityCreationLink, setShowCharityCreationLink] = useState(false)
  const { data: adminCheck } = useAdminCheckQuery()
  const isCharityAdmin = adminCheck?.isCharityAdmin
  const charityId = adminCheck?.charityId

  const isLoggedInCharity = user && Boolean(charityId)
  const isLoggedInBidder = user && !isCharityAdmin
  const charityIsCreated = charityId && charityId.length > 0
  const isPublic = !user

  const getGreeting = (isPublic: boolean, isLoggedInBidder: boolean, isLoggedInCharity: boolean) => {
    if (isPublic) return (
      <span className="text-black text-7xl font-black">
        Hey! <Link href="/SignUp" className="hover:underline text-fuschia-600">Sign up. </Link>
      </span>)
    if (isLoggedInBidder) return (
      <>
        <span className="text-black text-7xl font-black">
          Welcome back
        </span>
        <span className="text-black text-2xl font-medium">
          we're glad you're here
        </span>
      </>
    )
    if (isLoggedInCharity) return (
      <span className="text-black text-7xl font-black">
        Welcome charity admin, we're glad you're here
      </span>
    )
  }

  useEffect(() => {
    if (adminCheck?.isCharityAdmin && !charityIsCreated) {
      setShowCharityCreationLink(true)
    }
    if (charityIsCreated) {
      router.push(`/charities/${charityId}`)
    }
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
        {getGreeting(isPublic, isLoggedInBidder, isLoggedInCharity)}

        {(showCharityCreationLink) && (
          <>
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