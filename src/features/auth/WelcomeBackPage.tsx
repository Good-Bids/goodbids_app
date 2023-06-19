import { useRouter } from "next/router";
import { useUserQuery } from "~/hooks/useUser";

export const WelcomeBackPage = () => {
  const router = useRouter();
  const supabaseAuthLink =
    router.query.confirmation_url !== undefined
      ? !Array.isArray(router.query.confirmation_url)
        ? router.query.confirmation_url
        : "/"
      : "/";

  return (
    <div className="gap- w-11/12 flex-col">
      <h1 className="text-3xl font-black text-outerSpace-900">Welcome Back</h1>
      <a href={supabaseAuthLink}>
        <button className=" w-full rounded-full bg-cw-blue px-4 py-2 text-white">
          <p className="font-bold">click here to log in</p>
        </button>
      </a>
    </div>
  );
};
