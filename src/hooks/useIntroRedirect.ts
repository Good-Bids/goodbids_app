import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIntroRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    if (window) {
      if (window.localStorage.getItem("hasSeenIntro") === "true") {
        return;
      } else {
        router.push("/intro");
      }
    }
    return () => {};
  }, [router]);
};
