import { useState } from "react";
import { useCommentsQuery } from "~/hooks/useComment";
import { CommentBubble } from "./CommentBubble";
import { CommentInput } from "./CommentInput";

interface CommentContainer {
  auctionId: string;
}

export const CommentContainer = ({ auctionId }: CommentContainer) => {
  const [showComments, setShowComments] = useState(false);

  const { data: commentsData } = useCommentsQuery(auctionId);

  const displayData = commentsData ?? [];

  return (
    <div>
      <div
        className="my-4 flex max-w-full cursor-pointer flex-row items-center justify-start gap-2 border-t px-4 pt-4"
        onClick={() => setShowComments((prior) => !prior)}
      >
        <svg width="24" height="24">
          <path
            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3817 22 8.81782 21.6146 7.41286 20.888L3.58704 21.9553C2.92212 22.141 2.23258 21.7525 2.04691 21.0876C1.98546 20.8676 1.98549 20.6349 2.04695 20.4151L3.11461 16.5922C2.38637 15.186 2 13.6203 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 13.4696 3.87277 14.8834 4.57303 16.1375L4.72368 16.4072L3.61096 20.3914L7.59755 19.2792L7.86709 19.4295C9.12006 20.1281 10.5322 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z"
            fill="#232826"
          />
        </svg>
        <p className="text-l text-outerSpace-900">{` Discussion (${displayData.length})`}</p>
      </div>

      <div
        className={`mt-2 ${showComments ? "visible" : "hidden"} flex flex-col`}
      >
        <CommentInput auctionId={auctionId} />
        <div className=" flex flex-col gap-3 bg-cw-blue bg-opacity-10 p-3">
          {displayData.map((item) => (
            <CommentBubble {...item} key={item.message_id} />
          ))}
        </div>
      </div>
    </div>
  );
};
