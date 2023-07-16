import { useRouter } from "next/router";
import { useEffect } from "react";
import { charityColorTailwindString } from "~/utils/constants";

export const WelcomeBackPage = () => {
  const router = useRouter();
  const charity = "buildOn";
  const colorString = charityColorTailwindString[charity];

  useEffect(() => {
    if (router.query.confirmation_url !== undefined) {
      const supabaseAuthLink = !Array.isArray(router.query.confirmation_url)
        ? router.query.confirmation_url
        : "/";
      window.location.replace(supabaseAuthLink);
    }
  }, [router]);

  return (
    <div className="gap- w-11/12 flex-col">
      <h1 className="text-3xl font-black text-outerSpace-900">Welcome Back</h1>
      <a href={"/"}>
        <button
          className={`w-full rounded-full bg-${colorString} px-4 py-2 text-white`}
        >
          <p className="font-bold">
            If you're not redirected automatically, click this button
          </p>
        </button>
      </a>
    </div>
  );
};
