import { type NextPage } from "next";
import Link from "next/link";
import { useAdminCheckQuery } from "~/hooks/useCharityAdmin";
import { useUserQuery } from "~/hooks/useUser";
import * as ga from "../lib/ga";

const Home: NextPage = () => {
  const { data: user, isLoading: isUserQueryLoading } = useUserQuery();
  const { data: adminCheck } = useAdminCheckQuery();
  const isLoggedIn = Boolean(user);
  const isCharityAdmin = adminCheck?.isCharityAdmin ?? false;
  const charityId = adminCheck?.charityId;

  const isLoggedInCharity = isLoggedIn && isCharityAdmin;
  const isLoggedInBidder = isLoggedIn && !isCharityAdmin;
  const charityIsCreated = Boolean(charityId);
  const isPublic = !user && !isUserQueryLoading;
  const userFirstName = user?.user_metadata.name.split(" ")[0] ?? "friend";
  /* AD. tmp commenting out for retyping response returned from ReactQuery ( needs to support UI ) */
  // const { data: auctions } = useAuctionsQuery()

  const handleClick = () => {
    ga.event({ action: "button_click", params: { label: "Sign up today" } });
  };

  const getGreeting = (
    isPublic: boolean,
    isLoggedInBidder: boolean,
    isLoggedInCharity: boolean
  ) => {
    if (isPublic)
      return (
        <>
          <span className="text-7xl font-black text-bottleGreen">
            We're better with you here.
          </span>
          <span className="text-4xl font-black text-bottleGreen">
            <Link
              href="/SignUp"
              onClick={handleClick}
              className="decoration-screaminGreen hover:underline"
            >
              Sign up today.{" "}
            </Link>
          </span>
          <span className="text-4xl font-black text-bottleGreen">
            <Link
              href="/auctions"
              className="decoration-screaminGreen hover:underline"
            >
              View active auctions
            </Link>
          </span>
        </>
      );
    if (isLoggedInBidder)
      return (
        <>
          <span className="text-7xl font-black text-bottleGreen">
            Welcome back, {userFirstName}
          </span>
          <span className="text-2xl font-medium text-bottleGreen">
            we're glad you're here.
          </span>
        </>
      );
    if (isLoggedInCharity)
      return (
        <>
          <span className="text-7xl font-black text-bottleGreen">
            Welcome charity admin, we're glad you're here
          </span>
          {!charityIsCreated && (
            <>
              <span className="text-4xl font-black text-bottleGreen">
                <Link
                  href="/charities/create"
                  className="decoration-screaminGreen hover:underline"
                >
                  Register your goodCharity today
                </Link>
              </span>
              <span className="text-4xl font-black text-bottleGreen">
                <Link
                  href="/SignUp"
                  className="decoration-screaminGreen hover:underline"
                >
                  Sign up today.{" "}
                </Link>
              </span>
              <span className="text-4xl font-black text-bottleGreen">
                <Link
                  href="/auctions"
                  className="decoration-screaminGreen hover:underline"
                >
                  View active auctions
                </Link>
              </span>
            </>
          )}
        </>
      );
    if (isLoggedInBidder)
      return (
        <>
          <span className="text-7xl font-black text-bottleGreen">
            Welcome back, {userFirstName}
          </span>
          <span className="text-2xl font-medium text-bottleGreen">
            we're glad you're here.
          </span>
        </>
      );
    if (isLoggedInCharity)
      return (
        <>
          <span className="text-7xl font-black text-bottleGreen">
            Welcome charity admin, we're glad you're here
          </span>
          {!charityIsCreated ? (
            <span className="text-4xl font-black text-bottleGreen">
              <Link
                href="/charities/create"
                className="decoration-screaminGreen hover:underline"
              >
                Register your goodCharity today
              </Link>
            </span>
          ) : (
            <span className="text-4xl font-black text-bottleGreen">
              <Link
                href={`/charities/${charityId}`}
                className="decoration-screaminGreen hover:underline"
              >
                Your Charity Page
              </Link>
            </span>
          )}
        </>
      );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        {getGreeting(isPublic, isLoggedInBidder, isLoggedInCharity)}
        {isLoggedInBidder && (
          <Link href={"/auctions"}>
            <span className="font-bold text-cornflowerLilac">
              View active Auctions
            </span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Home;
