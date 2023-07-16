import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuctionRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    if (window) {
      if (window.localStorage.getItem("auctionSource")) {
        const prize = localStorage.getItem("auctionSource");
        router.push(`/${prize}`);
      }
    }
    return () => {};
  }, [router]);
};
