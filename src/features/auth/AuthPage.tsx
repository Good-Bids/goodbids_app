import React, { useState } from "react";
import { useRouter } from "next/router";
import useSupabase from "~/hooks/useSupabase";
import { useInterval } from "usehooks-ts";

interface AuthPageProps {
  method: "Login" | "Signup";
}

export const AuthPage = ({ method }: AuthPageProps) => {
  const actionString = method === "Login" ? "Log in" : "Sign up";

  const router = useRouter();
  const [loginData, setLoginData] = useState<{ email: string }>({
    email: "",
  });
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [rerouteDelay, setRerouteDelay] = useState(5);

  const supabaseClient = useSupabase();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/";
    // Make sure to include `https://` when not localhost.
    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return url;
  };

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
          redirectTo: getURL(),
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
          emailRedirectTo: getURL(),
        },
      });
      setHasSubmittedEmail(true);
    } catch (error) {
      throw error;
    }
  }

  useInterval(() => {
    if (hasSubmittedEmail) {
      if (rerouteDelay > 0) {
        setRerouteDelay((prior) => prior - 1);
      } else router.push("/");
    }
  }, 1000);

  return (
    <div className="my-12 flex w-11/12 flex-col justify-center gap-4 overflow-scroll">
      <h1 className="text-3xl font-black text-outerSpace-900">
        {method === "Login" ? "Welcome Back" : "Sign up"}
      </h1>
      {!hasSubmittedEmail ? (
        <>
          <label className="block" key={"email"}>
            <p className="block text-sm font-bold text-slate-700">
              {`${actionString} with email`}
            </p>
            <p>FOR TESTING ONLY - {process?.env?.NEXT_PUBLIC_VERCEL_URL}</p>
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
            className="rounded-full bg-bottleGreen px-4 py-2 text-white"
          >
            <p className="font-bold">{actionString}</p>
          </button>
          <br />
          <p className="font-bold text-slate-700">Or...</p>
          <button
            className="flex flex-row justify-center gap-2 rounded-full border border-bottleGreen px-4 py-2"
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
            <p className="font-bold">{actionString} with Google</p>
          </button>
        </>
      ) : (
        <>
          <p className="text-3xl font-black text-outerSpace-900">
            Thanks! check your email for a link back here (it may have ended up
            in your spam folder).
          </p>
          <p className="text-xl font-black text-outerSpace-900">
            Redirecting to the home page in {rerouteDelay}…
          </p>
        </>
      )}
    </div>
  );
};
