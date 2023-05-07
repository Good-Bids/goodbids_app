import { useRouter } from "next/router";

export const WelcomeBackPage = () => {
  const router = useRouter();
  const supabaseAuthLink =
    router.query.confirmation_url !== undefined
      ? !Array.isArray(router.query.confirmation_url)
        ? router.query.confirmation_url
        : "/"
      : "/";

  console.log(router);

  return (
    <div className="gap- w-11/12 flex-col">
      <h1 className="text-3xl font-black text-outerSpace-900">Welcome Back</h1>
      <a href={supabaseAuthLink}>
        <button className=" w-full rounded-full bg-bottleGreen px-4 py-2 text-white">
          <p className="font-bold">click here to sign in</p>
        </button>
      </a>
    </div>
  );
};