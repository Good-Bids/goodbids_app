import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSupabase from "~/hooks/useSupabase";
import { charityColorTailwindString } from "~/utils/constants";

interface AuthPageProps {
  method: "logIn" | "signUp";
}

export const AuthPage = ({ method }: AuthPageProps) => {
  const actionString = method === "logIn" ? "Log in" : "Sign up";

  const router = useRouter();
  const [source, setSource] = useState("/");
  const [loginData, setLoginData] = useState<{ email: string }>({
    email: "",
  });
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [rerouteDelay, setRerouteDelay] = useState(5);

  const supabaseClient = useSupabase();

  const colorString = charityColorTailwindString["buildOn"];

  const stagingSite = process?.env?.NEXT_PUBLIC_VERCEL_URL;
  const productionSite = !!process?.env?.NEXT_PUBLIC_SITE_URL
    ? "https://www.goodbids.org"
    : stagingSite;

  const getURL = () => {
    let url =
      productionSite ?? // Set this to your site URL in production env.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };

  const url = getURL();

  const handleChange = (e: { target: { value: string; name: string } }) => {
    const target = e.target.name;
    const newValue = e.target.value;
    setLoginData((prior) => ({ ...prior, [target]: newValue }));
  };

  const handleGoogleLogin = async () => {
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: url,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  async function signInWithEmail() {
    try {
      await supabaseClient.auth.signInWithOtp({
        email: loginData.email,
        options: {
          emailRedirectTo: url,
        },
      });
      setHasSubmittedEmail(true);
    } catch (error) {
      throw error;
    }
  }

  const pageCopy = {
    logIn: {
      greeting: "Welcome Back",
      reminder: "Don't have an account? Click here to sign up",
      linkOut: "/signup",
    },
    signUp: {
      greeting: "Sign Up",
      reminder: "Already Signed up? Click here to log in",
      linkOut: "/login",
    },
  };
  useEffect(() => {
    if (window !== undefined) {
      const auctionSource = window.localStorage.getItem("auctionSource");
      switch (auctionSource) {
        case "watch":
          setSource("/watch");
          break;
        case "trek":
          setSource("/trek");
          break;
        default:
          setSource("/");
      }
    }
  }, []);

  return (
    <div className="my-12 flex h-full w-11/12 flex-col items-center justify-center gap-4 overflow-auto sm:w-[450px]">
      {!hasSubmittedEmail ? (
        <div className="flex w-full flex-col items-center">
          <h1 className="mb-8 text-3xl font-black text-outerSpace-900 sm:mb-16">
            {pageCopy[method].greeting}
          </h1>
          <div className="flex w-full flex-row justify-between gap-2 sm:w-[450px]">
            <label className="block w-2/3" key={"email"}>
              <p className="text-md block font-bold text-outerSpace-900">
                {`${actionString} with email`}
              </p>

              <input
                type={"email"}
                name={"email"}
                value={loginData.email}
                onChange={handleChange}
                placeholder="your email..."
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
              invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none
              focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500
              disabled:border-slate-200 disabled:bg-slate-50
              disabled:text-slate-500 disabled:shadow-none"
              />
            </label>
            <button
              onClick={() => signInWithEmail()}
              className={`bg-${colorString} h-fit w-1/3 self-end rounded-full px-4 py-2 text-white`}
            >
              <p className="font-bold">submit</p>
            </button>
          </div>
          <p className="my-2 text-xs text-outerSpace-500">
            (you don't need a password - we'll send you a secure link to
            authenticate.)
          </p>
          <br />
          <p className="font-bold text-outerSpace-900">Or...</p>
          <button
            className={`flex w-full flex-row justify-center gap-2 rounded-full border border-bo-red px-4 py-2`}
            onClick={() => handleGoogleLogin()}
          >
            <svg
              className="c-eSSyNk"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="21px"
              height="21px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <p className="text-md font-bold text-outerSpace-900">
              {actionString} with Google
            </p>
          </button>

          <a
            href={pageCopy[method].linkOut}
            className="mt-8 px-4 py-2 text-xs text-outerSpace-900 underline"
          >
            <p>{pageCopy[method].reminder}</p>
          </a>
          {method === "signUp" && (
            <Link href="/terms">
              <p className="mt-16 text-base font-bold text-bo-red sm:mt-32">
                Terms of Service
              </p>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <p className="self-center text-2xl font-black text-outerSpace-900">
            Thanks!
          </p>
          <p className="text-lg text-outerSpace-900">
            Check your email for a link back to the site (it may have ended up
            in your spam folder).
          </p>
          <a href={source} className="self-center">
            <button className="container w-fit rounded-full bg-bo-red px-4 py-2 text-lg font-bold text-white">
              <p>back to {source.split("/")[1]} auction</p>
            </button>
          </a>
        </div>
      )}
    </div>
  );
};
