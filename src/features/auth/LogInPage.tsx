import { useState } from "react";
import { useRouter } from "next/router";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { useUserQuery } from "~/hooks/useUser";
import useSupabase from "~/hooks/useSupabase";

export const LogInPage = () => {
  const user = useUserQuery();
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"OAuth" | "email">("email");
  const [loginData, setLoginData] = useState<SignInWithPasswordCredentials>({
    email: "",
    password: "",
  });

  const supabaseClient = useSupabase();

  const handleLogin = (data: unknown) => {
    supabaseClient.auth
      .signInWithPassword(loginData)
      .then((data) => {
        window.alert(data);
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  const handleChange = (e: { target: { value: string; name: string } }) => {
    const target = e.target.name;
    const newValue = e.target.value;
    setLoginData((prior) => ({ ...prior, [target]: newValue }));
  };

  if (!user) {
    return (
      <div className="w-50 flex flex-col overflow-scroll">
        <h1 className="text-4xl font-bold">Sign in</h1>
        <form>
          {["email", "password"].map((field) => (
            <label className="block" key={field}>
              <span className="block text-sm font-medium text-slate-700">
                {field}
              </span>
              <input
                type={field}
                name={field}
                value={loginData[field as keyof typeof loginData] as string}
                onChange={handleChange}
                className='class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
      invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none
      focus:ring-1 focus:ring-sky-500 focus:invalid:border-pink-500 focus:invalid:ring-pink-500
      disabled:border-slate-200 disabled:bg-slate-50
      disabled:text-slate-500 disabled:shadow-none'
              />
            </label>
          ))}
          <input
            type="submit"
            onSubmit={handleLogin}
            className="cursor-pointer"
          />
        </form>
      </div>
    );
  } else router.push("/auctions");
};
