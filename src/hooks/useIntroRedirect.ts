import { useEffect } from "react";

export const useIntroRedirect = (
  prize: "watch" | "trek",
  handleOpenChange: (arg0: boolean) => void
) => {
  useEffect(() => {
    if (window) {
      window.localStorage.setItem("auctionSource", prize);
      if (window.localStorage.getItem(`hasSeenIntroFor${prize}`) === "true") {
        return;
      } else {
        handleOpenChange(true);
      }
    }
    return () => {};
  }, []);
};
