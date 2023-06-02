import { useEffect, useState } from "react";
import { useUserQuery } from "./useUser";

export const useUserName = () => {
  const { data: userData } = useUserQuery();
  const [user, setUser] = useState<{ name: string; id: string }>({
    name: "anonymous",
    id: "anonymous",
  });
  useEffect(() => {
    if (userData) {
      const enhancedUserName =
        userData.user_metadata.name ??
        userData.email ??
        userData.id ??
        "anonymous";
      const userId = userData.id ?? "anonymous";
      setUser({ name: enhancedUserName, id: userId });
    }
  }, [userData]);
  return user;
};
