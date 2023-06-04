import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  messageHasReactions,
  MessageOptions,
  MessageRepliesCountButton,
  MessageStatus,
  MessageText,
  MessageTimestamp,
  ReactionSelector,
  SimpleReactionsList,
  useMessageContext,
} from "stream-chat-react";

export const CustomChatMessage = () => {
  const {
    isReactionEnabled,
    message,
    reactionSelectorRef,
    showDetailedReactions,
  } = useMessageContext();

  const messageWrapperRef = useRef(null);

  const hasReactions = messageHasReactions(message);

  return (
    <div className="flex w-full flex-col items-start">
      <Avatar image={message.user?.image} />
      <div className="flex w-full flex-col items-start">
        <MessageOptions messageWrapperRef={messageWrapperRef} />
        <div className="flex">
          <div className="font-weight-500 h-5 text-base text-outerSpace-400">
            {message.user?.name}
          </div>
          <div className="font-weight-500 ml-2 h-5 text-base text-outerSpace-400">
            <MessageTimestamp />
          </div>
        </div>
        {showDetailedReactions && isReactionEnabled && (
          <ReactionSelector ref={reactionSelectorRef} />
        )}
        <MessageText />
        <MessageStatus />
        {hasReactions && !showDetailedReactions && isReactionEnabled && (
          <SimpleReactionsList />
        )}
        <MessageRepliesCountButton reply_count={message.reply_count} />
      </div>
    </div>
  );
};
