import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { useUserQuery } from "~/hooks/useUser";
import { env } from "~/env.mjs";
import { useUserName } from "~/hooks/useUserName";

interface ContextProps {
  children: React.ReactNode;
}

export const UserContext = createContext({
  user: "unauthenticated",
  jwt: "nothing",
});

export const UserContextProvider = ({ children }: ContextProps) => {
  const [userJWT, setUserJWT] = useState<string>("nothing");

  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes("#access_token=")) {
      const jwtResponse =
        router.asPath.split("#access_token=")[1]?.split("&")[0] ?? "";
      setUserJWT(jwtResponse);
    }
  }, [router.asPath]);

  const userName = useUserName();

  return (
    <UserContext.Provider
      value={{ user: userName ?? "unauthenticated", jwt: userJWT }}
    >
      {children}
    </UserContext.Provider>
  );
};
