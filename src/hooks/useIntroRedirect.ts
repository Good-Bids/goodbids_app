import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIntroRedirect = (
  prize: "watch" | "trek",
  handleOpenChange: (arg0: boolean) => void
) => {
  const router = useRouter();
  useEffect(() => {
    if (window) {
      window.localStorage.setItem("auctionSource", prize);
      if (window.localStorage.getItem(`hasSeenIntroFor${prize}`) === "true") {
        return;
      } else {
        window.localStorage.setItem(`hasSeenIntroFor${prize}`, "true");
        if (window.innerWidth >= 640) {
          handleOpenChange(true);
        } else {
          router.push(`/${prize}-intro`);
        }
      }
    }
    return () => {};
  }, []);
};
