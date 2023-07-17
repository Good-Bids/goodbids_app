import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIntroRedirect = (prize: "watch" | "trek") => {
  const router = useRouter();
  useEffect(() => {
    if (window) {
      window.localStorage.setItem("auctionSource", prize);
      if (window.localStorage.getItem(`hasSeenIntroFor${prize}`) === "true") {
        return;
      } else {
        router.push(`/${prize}-intro`);
      }
    }
    return () => {};
  }, [router]);
};
