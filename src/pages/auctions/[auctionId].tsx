import { StreamChat } from "stream-chat";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { env } from "~/env.mjs";

import { AuctionDetailPage } from "~/features/auctions/AuctionDetailPage";

export const getServerSideProps: GetServerSideProps<{
  chatToken: string;
}> = async (context) => {
  const api_key = env.NEXT_PUBLIC_STREAM_KEY;
  const api_secret = env.NEXT_PUBLIC_STREAM_SECRET;
  const { id } = context.query;
  const userId = id && !Array.isArray(id) ? id : undefined;
  let chatToken: string = "";

  if (userId) {
    // Initialize a Server Client
    const serverClient = StreamChat.getInstance(api_key, api_secret);
    // Create User Token
    chatToken = await serverClient.createToken(userId ?? "unknown");
  }

  return {
    props: {
      chatToken,
    },
  };
};

const AuctionPage = ({
  chatToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <AuctionDetailPage chatToken={chatToken} />;
};

export default AuctionPage;
