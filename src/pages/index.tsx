import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Script from 'next/script'
import { useAuctionsQuery } from "~/hooks/useAuction";
import { useAdminCheckQuery } from "~/hooks/useCharityAdmin";
import { useUserQuery } from "~/hooks/useUser";
import * as ga from '../lib/ga'

const Home: NextPage = () => {

  const { data: user, isLoading: isUserQueryLoading } = useUserQuery()
  const { data: adminCheck } = useAdminCheckQuery()
  const isLoggedIn = Boolean(user)
  const isCharityAdmin = adminCheck?.isCharityAdmin ?? false
  const charityId = adminCheck?.charityId

  const isLoggedInCharity = isLoggedIn && isCharityAdmin
  const isLoggedInBidder = isLoggedIn && !isCharityAdmin
  const charityIsCreated = Boolean(charityId)
  const isPublic = (!user && !isUserQueryLoading)
  const userFirstName = user?.user_metadata.name.split(' ')[0] ?? 'friend'
  /* AD. tmp commenting out for retyping response returned from ReactQuery ( needs to support UI ) */
  // const { data: auctions } = useAuctionsQuery()

  const handleClick = () => {
    ga.event({ action: 'button_click', params: { label: 'Sign up today' } })
  }

  const getGreeting = (isPublic: boolean, isLoggedInBidder: boolean, isLoggedInCharity: boolean) => {
    if (isPublic) return (
      <>
        <span className="text-bottleGreen text-7xl font-black">
          We're better with you here.
        </span>
        <span className="text-bottleGreen text-4xl font-black">
          <Link href="/SignUp" onClick={handleClick} className="hover:underline decoration-screaminGreen">Sign up today. </Link>
        </span>
        <span className="text-bottleGreen text-4xl font-black">
          <Link href="/auctions" className="hover:underline decoration-screaminGreen">View active auctions</Link>
        </span>
      </>
    )
    if (isLoggedInBidder) return (
      <>
        <span className="text-bottleGreen text-7xl font-black">
          Welcome back, {userFirstName}
        </span>
        <span className="text-bottleGreen text-2xl font-medium">
          we're glad you're here.
        </span>
      </>
    )
    if (isLoggedInCharity) return (
      <>
        <span className="text-bottleGreen text-7xl font-black">
          Welcome charity admin, we're glad you're here
        </span>
        {!charityIsCreated ? (
          <span className="text-bottleGreen text-4xl font-black">
            <Link href="/charities/create" className="hover:underline decoration-screaminGreen">Register your goodCharity today</Link>
          </span>
        ) : <span className="text-bottleGreen text-4xl font-black">
          <Link href={`/charities/${charityId}`} className="hover:underline decoration-screaminGreen">Your Charity Page</Link>
        </span>}
      </>
    )
  }


  return (
    <>
      <Head>
        <title>GoodBids</title>
        <meta name="description" content="Donate & Win" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-CXJ4181QHF"
        strategy="afterInteractive"
      />
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CXJ4181QHF');
        `}
      </Script>
      </div>
      <div className="flex flex-col items-center gap-2">
        {getGreeting(isPublic, isLoggedInBidder, isLoggedInCharity)}
        {isLoggedInBidder && (<Link href={'/auctions'}><span className="text-cornflowerLilac font-bold">
          View active Auctions
        </span></Link>)}
      </div>
    </>
  );
};

export default Home;