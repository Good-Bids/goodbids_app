import { useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import type { Channel as ChannelType } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { env } from "~/env.mjs";
import { Auction } from "~/utils/types/auctions";
import { useUserName } from "~/hooks/useUserName";
import { useConnectStreamChatUser } from "~/hooks/useConnectStreamChatUser";

interface ChatContainerProps {
  auction: Auction;
  chatToken: string;
}

export const ChatContainer = (props: ChatContainerProps) => {
  const { auction, chatToken } = props;
  const [channel, setChannel] = useState<ChannelType>();

  const userData = useUserName();

  const client = useConnectStreamChatUser(
    env.NEXT_PUBLIC_STREAM_KEY,
    userData,
    chatToken
  );

  useEffect(() => {
    if (client && userData && chatToken) {
      if (client._hasConnectionID()) {
        const auctionChannel = client.channel(
          "livestream",
          auction.auction_id,
          {
            name: auction.name,
          }
        );
        setChannel(auctionChannel);
      }
    }
  }, [client, userData]);

  if (!client) return null;

  const disabledChat = userData.name === "anonymous";

  return (
    client && (
      <div className="h-full w-full">
        <Chat client={client}>
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              {!disabledChat && (
                <MessageInput disabled={disabledChat} noFiles />
              )}
            </Window>
          </Channel>
        </Chat>
      </div>
    )
  );
};
