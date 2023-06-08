import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useMessageBus } from "~/contexts/Subscriptions";
import { PayPalDialog } from "~/features/auctions/PayPalDialog";
import {
  useAuctionPresence,
  useAuctionQuery,
  useBidsByAuction,
} from "~/hooks/useAuction";
import { useAuctionTimer } from "~/hooks/useAuctionTimer";
import { useItemQuery } from "~/hooks/useItem";
import { useStorageItemsQuery } from "~/hooks/useStorage";
import { useUserQuery } from "~/hooks/useUser";
import { fileStoragePath } from "~/utils/constants";
import { Auction } from "~/utils/types/auctions";
import { ChatContainer } from "../chat/ChatContainer";

export const CharityWater = () => {
  const [chatToken, setChatToken] = useState("");
  const auctionId = "6b2300f1-33d9-4210-8ae2-0d80d1cf931a";
  const { data: userData } = useUserQuery();
  const { data: auctionData } = useAuctionQuery(auctionId);
  const { data: bidsData } = useBidsByAuction(auctionId);
  const subscription = useMessageBus();
  const { data: auctionImages } = useStorageItemsQuery(auctionId);
  const { data: itemData } = useItemQuery(auctionData?.item_id ?? "");

  const [auctionIsActive, setAuctionIsActive] = useState(true);
  const [nextBidValue, setNextBidValue] = useState(0);
  const [displayAuction, setDisplayAuction] = useState(auctionData);

  const [userId, setUserId] = useState<string>("unauthenticated");

  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auctionId}/${item.name}`
  );

  const getChatToken = async (userId: string) => {
    return await fetch("/api/token", { method: "POST", body: userId }).then(
      (res) => {
        return res.json();
      }
    );
  };

  useEffect(() => {
    getChatToken(userId).then((res) => {
      const { chatToken: token } = res;
      setChatToken(token);
    });
  }, [userId]);

  useEffect(() => {
    if (displayAuction) {
      if (displayAuction.high_bid_value && displayAuction.increment) {
        setNextBidValue(
          displayAuction.high_bid_value + displayAuction.increment
        );
      }
    }
  }, [displayAuction]);

  useEffect(() => {
    if (auctionData) {
      setDisplayAuction(auctionData);
    }
    if (!subscription.messageBus.isInitialized) return;
    // Listen for auction update messages
    if (subscription.messageBus.lastAuctionUpdateMessage) {
      const { auction: updatedAuction, eventType } =
        subscription.messageBus.lastAuctionUpdateMessage;
      if (updatedAuction.auction_id === auctionId) {
        if (eventType === "UPDATE") {
          setDisplayAuction(updatedAuction);
        }
      }
    }
  }, [
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastAuctionUpdateMessage,
  ]);

  const auctionStats = {
    bidCount: bidsData?.length ?? 0,
    totalRaised: bidsData?.reduce((acc, curr) => acc + curr.bid_value, 0) ?? 0,
    totalParticipants:
      bidsData
        ?.map((bid) => bid.bidder_id)
        .filter((v, i, s) => s.indexOf(v) === i).length ?? 0,
    myContribution:
      bidsData
        ?.filter((bid) => bid.bidder_id === userData?.id)
        ?.reduce((acc, curr) => acc + curr.bid_value, 0) ?? 0,
  };

  useEffect(() => {
    if (userData) {
      setUserId(userData.id);
    }
  }, [userData]);

  const attendance = useAuctionPresence(auctionId, userId);
  const attendanceString = () => {
    const otherCount = attendance.length - 1;
    if (otherCount == 0) {
      return `You're the only one here. Now's your chance!`;
    } else
      return `${otherCount} other ${
        otherCount == 1 ? "person is" : "people are"
      } looking at this auction right now.`;
  };

  const { string: timeLeft } = useAuctionTimer({
    auction: displayAuction as Auction,
    onTimeUpdate: setAuctionIsActive,
    interval: 100,
  });

  return auctionData ? (
    <div>
      {imageUrls && (
        <div className="border-collapse border-4 border-solid border-red-400">
          <p className="text-xl font-black text-black">Images</p>
          <ImageCarousel sources={imageUrls} />
        </div>
      )}
      <div className="border-collapse border-4 border-solid border-blue-400">
        <Link href="/Login">
          <p className="text-xl font-black text-black">
            authentication (link to auth page)
          </p>
        </Link>
      </div>
      <div className="border-4 border-solid border-yellow-400">
        <p className="text-xl font-black text-black">bid now</p>
        <PayPalDialog
          bidValue={nextBidValue}
          auction={auctionData}
          isBidLocked={!auctionIsActive}
        />
      </div>
      <div className="border-4 border-solid border-green-400">
        <p className="text-xl font-black text-black">auction stats</p>
        <div
          className="flex border-collapse flex-row justify-start gap-2 border-b border-y-outerSpace-100 py-3"
          role="attendance count"
        >
          <svg width="24" height="24">
            <path
              d="M6.15636 9.3231L6.15395 9.32491L6.15 9.3279L6.13963 9.33586C6.13164 9.34204 6.12151 9.34999 6.10942 9.35973C6.08524 9.37919 6.05314 9.40581 6.01442 9.43966C5.93703 9.50732 5.83284 9.6042 5.71236 9.73104C5.47171 9.98437 5.16368 10.3598 4.8751 10.8629C4.29291 11.8779 3.80368 13.3906 4.07868 15.4142C4.34997 17.4107 5.18833 19.0801 6.60711 20.244C8.02084 21.4038 9.93533 22 12.25 22C14.6375 22 16.5425 21.1054 17.8042 19.5699C19.0544 18.0486 19.6122 15.9741 19.4787 13.706C19.3508 11.5302 18.1656 9.87945 17.1188 8.42123C17.0177 8.28043 16.9179 8.14142 16.8205 8.00391C15.6785 6.39222 14.7768 4.90657 14.9959 2.82863C15.0182 2.61721 14.9497 2.40625 14.8075 2.24824C14.6652 2.09023 14.4626 2 14.25 2C13.868 2 13.4309 2.11822 13.0077 2.29599C12.5715 2.47923 12.0984 2.74751 11.6351 3.09694C10.7104 3.79438 9.78589 4.84563 9.29236 6.25159C8.80006 7.65408 9.04947 8.99089 9.41008 9.9632C9.64689 10.6017 9.39005 11.233 9.00347 11.4165C8.66159 11.5789 8.25252 11.4427 8.07619 11.1078L7.26887 9.57452C7.16673 9.38052 6.98481 9.24093 6.77099 9.19248C6.55717 9.14403 6.33215 9.19209 6.15636 9.3231Z"
              fill="#212121"
            />
          </svg>

          {attendanceString()}
        </div>
        <div
          className="flex border-collapse flex-row justify-start gap-2 border-y border-y-outerSpace-100 py-3"
          role="participant count"
        >
          <svg width="24" height="24">
            <path
              d="M14 4.25266C14 3.7005 14.4477 3.25289 15 3.25289C15.5523 3.25289 16 3.7005 16 4.25266V10.9993C16 11.2754 16.2239 11.4992 16.5 11.4992C16.7761 11.4992 17 11.2754 17 10.9993V5.9991C17 5.44694 17.4477 4.99932 18 4.99932C18.5523 4.99932 19 5.44694 19 5.9991V14.7539C19 16.9328 17.8316 19.2623 17.086 20.5415C16.5298 21.4956 15.5059 22 14.4634 22H12.2954C11.0642 22 9.93867 21.3044 9.38825 20.2033L9.25488 19.9366C8.83419 19.095 8.30955 18.3095 7.69325 17.5986L5.48144 15.047L3.28954 13.3426C3.10685 13.2005 3 12.9821 3 12.7507C3 12.266 3.25911 11.906 3.59157 11.6913C3.88769 11.5 4.24163 11.4183 4.55363 11.3812C5.1898 11.3057 5.96355 11.3829 6.64292 11.5147C7.15644 11.6144 7.61705 11.8087 8 12.0191V4.25266C8 3.7005 8.44771 3.25289 9 3.25289C9.55229 3.25289 10 3.7005 10 4.25266V10.5013C10 10.7773 10.2239 11.0011 10.5 11.0011C10.7761 11.0011 11 10.7773 11 10.5013V2.99977C11 2.44761 11.4477 2 12 2C12.5523 2 13 2.44761 13 2.99977V10.5013C13 10.7773 13.2239 11.0011 13.5 11.0011C13.7761 11.0011 14 10.7773 14 10.5013V4.25266Z"
              fill="#212121"
            />
          </svg>

          {`${auctionStats.totalParticipants} GoodBidders | ${auctionStats.bidCount} GoodBids`}
        </div>
        <div
          className="flex border-collapse flex-row justify-start gap-2 border-y border-y-outerSpace-100 py-3"
          role="time left"
        >
          <svg width="24" height="24">
            <path
              d="M15.25 13.5H11.25C10.836 13.5 10.5 13.164 10.5 12.75V6.75C10.5 6.336 10.836 6 11.25 6C11.664 6 12 6.336 12 6.75V12H15.25C15.664 12 16 12.336 16 12.75C16 13.164 15.664 13.5 15.25 13.5ZM12 2C6.478 2 2 6.478 2 12C2 17.522 6.478 22 12 22C17.522 22 22 17.522 22 12C22 6.478 17.522 2 12 2Z"
              fill="#212121"
            />
          </svg>

          {`Ending in ${timeLeft} if nobody else bids`}
        </div>
        <div className="flex w-full flex-row justify-between py-3">
          <div className="w-1/5">
            {`Est value: $${itemData?.value?.toLocaleString()}`}
          </div>
          <div className="w-1/4">
            {`Total Raised: $${auctionStats.totalRaised.toLocaleString()}`}
          </div>
          <div className="w-1/5">
            {`Your total: $${auctionStats.myContribution.toLocaleString()}`}
          </div>
        </div>
      </div>
      {chatToken && (
        <div className="border-4 border-solid border-purple-400">
          <p className="text-xl font-black text-black">
            chat / comments (sign in to comment)
          </p>
          <ChatContainer auction={auctionData} chatToken={chatToken} />
        </div>
      )}
      <div className="border-4 border-solid border-cyan-400">
        <p className="text-xl font-black text-black">auction content</p>
        <p>
          This may be the opportunity of a lifetime. You could be the lucky
          bidder and win a private dinner with Sir Paul McCartney at an
          exclusive restaurant in New York City, as well as a signed bass
          guitar! The love you take is equal to the love you make. All donations
          go directly to charity:water. Win or lose, your donation makes a
          difference. Each donation received in this positive auction is also a
          bid to win dinner with Sir Paul. The experience of dining with Sir
          Paul McCartney is a dream come true for any music lover. You'll have
          the chance to enjoy a gourmet meal while chatting with one of the most
          influential musicians of our time. Imagine discussing the Beatles'
          early days, their rise to fame, and the inspiration behind some of
          their greatest hits. Sir Paul McCartney is an engaging and fascinating
          conversationalist, and this is a once-in-a-lifetime opportunity to get
          to know him on a personal level. You can bring a camera for selfies,
          of course. The winner of this auction will also receive a signed bass
          guitar from Sir Paul McCartney himself. Imagine owning a piece of
          music history and displaying it in your home. The bass guitar will
          come with a certificate of authenticity, ensuring that it is a genuine
          item signed by the legend himself. Not only will you have the
          experience of a lifetime, but you'll also be contributing to a worthy
          cause. Every bid is a donation directly to charity:water. Win or lose,
          you can feel good knowing that your winning bid will make a real
          difference to thousands of people who struggle every day. There is no
          reserve. The last bidder wins the prize package. Every other bid is
          fully tax-deductible donation. Winner is responsible for any taxes as
          well as transportation to the event. This is your chance to be part of
          music history and create memories that will last a lifetime. Don't
          miss out on the opportunity to dine with Sir Paul McCartney and own a
          signed bass guitar. Bid now and support a worthy cause at the same
          time.
        </p>
      </div>
      <div className="border-4 border-solid border-pink-400">
        <p className="text-xl font-black text-black">charity content</p>
        <p>
          charity: water is a nonprofit organization bringing clean and safe
          water to people around the world. Together, we can end the water
          crisis 771 million people in the world live without clean water.
          That’s nearly 1 in 10 people worldwide. Or, twice the population of
          the United States. The majority live in isolated rural areas and spend
          hours every day walking to collect water for their family. Not only
          does walking for water keep children out of school or take up time
          that parents could be using to earn money, but the water often carries
          diseases that can make everyone sick. But access to clean water means
          education, income and health - especially for women and kids. Since
          charity: water was founded in 2006, we’ve been chasing one ambitious
          goal: ending the global water crisis. And while the water crisis is
          huge, we’re optimistic. We know how to solve the problem, and we make
          progress every day thanks to the help of local partners and generous
          supporters. If we work together, we believe everyone will have access
          to life’s most basic need within our lifetime. We’ve already helped
          16,000,000 people get access to clean water, but there’s a lot more
          work to do. 100% of the donations we receive go directly to fund water
          projects.
        </p>
        <iframe
          width="800px"
          height="450px"
          src="https://www.youtube.com/embed/gP6p7_Sd3MU"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
