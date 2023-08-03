import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCommentsQuery } from "~/hooks/useComment";
import { useUserQuery } from "~/hooks/useUser";
import { CommentBubble } from "./CommentBubble";
import { CommentInput } from "./CommentInput";

interface CommentContainer {
  auctionId: string;
  charity: "buildOn" | "charityWater";
}

export const CommentContainer = ({ auctionId, charity }: CommentContainer) => {
  const [showComments, setShowComments] = useState(false);

  const { data: commentsData } = useCommentsQuery(auctionId);

  const isDesktop = window && window.innerWidth >= 767;

  const userData = useUserQuery();

  const displayData = commentsData ?? [];

  const conversationRef = useRef<HTMLDivElement>(null);

  const colorString = "bo-red";

  useEffect(() => {
    if (conversationRef.current && displayData) {
      conversationRef.current.scrollTo({
        top: displayData.length * 200,
        behavior: "auto",
      });
    }
  }, [displayData]);

  return (
    <div className="overflow-y-clip sm:mb-4 sm:mt-2 sm:flex sm:h-[92%] sm:min-w-[280px] sm:flex-col sm:gap-0 sm:border-[1px] sm:border-outerSpace-100">
      <div
        className="sm:h-1/12 mb-0 mt-4 flex max-w-full flex-row items-center justify-start gap-2 border-t px-4 pt-4 sm:mb-2 sm:mt-0  sm:pb-2 sm:pt-0"
        onClick={() => setShowComments((prior) => !prior)}
        id="comments header"
      >
        <svg width="24" height="24" className="sm:mt-2">
          <path
            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3817 22 8.81782 21.6146 7.41286 20.888L3.58704 21.9553C2.92212 22.141 2.23258 21.7525 2.04691 21.0876C1.98546 20.8676 1.98549 20.6349 2.04695 20.4151L3.11461 16.5922C2.38637 15.186 2 13.6203 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 13.4696 3.87277 14.8834 4.57303 16.1375L4.72368 16.4072L3.61096 20.3914L7.59755 19.2792L7.86709 19.4295C9.12006 20.1281 10.5322 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z"
            fill="#232826"
          />
        </svg>
        <p className="text-l text-outerSpace-900 sm:mt-3">{` Comments (${displayData.length})`}</p>
      </div>

      <div
        id="commentsBody"
        className={`mt-2 sm:mt-0 ${
          showComments || isDesktop ? "visible" : "hidden"
        } flex flex-col items-center justify-center sm:h-2/3 sm:flex-grow sm:flex-col-reverse`}
      >
        {!userData.data?.email && (
          <Link
            href="/login"
            className="my-0 flex h-12 w-full items-center justify-center text-center text-xs text-outerSpace-500 sm:my-2 sm:mb-4 sm:h-fit sm:min-h-[5%] sm:w-5/6 sm:cursor-pointer sm:border-[1px] sm:border-outerSpace-100"
          >
            <p className="text-base font-bold text-bo-red">Log in to comment</p>
          </Link>
        )}
        <CommentInput auctionId={auctionId} charity="buildOn" />
        <div
          className={`flex h-40 w-full flex-1 gap-3 overflow-y-auto sm:h-2/3 sm:flex-col bg-${colorString} flex-col-reverse overflow-clip bg-opacity-10 p-3 sm:max-h-[95%]`}
          ref={conversationRef}
        >
          {displayData.map((item) => (
            <CommentBubble {...item} key={item.message_id} charity="buildOn" />
          ))}
        </div>
      </div>
    </div>
  );
};
