import { useUserQuery } from "~/hooks/useUser";
import { charityColorTailwindString } from "~/utils/constants";

interface Comment {
  text: string;
  user: string;
  user_name: string;
  message_id: string;
  created_at: string;
  charity: "buildOn" | "charityWater";
}

export const CommentBubble = ({
  user,
  text,
  user_name,
  message_id,
  created_at,
  charity,
}: Comment) => {
  const { data: currentUser } = useUserQuery();
  const isMe = currentUser?.id === user;
  const date = new Date(created_at).toDateString();
  const colorString = charityColorTailwindString[charity];
  return (
    <div
      className={`h-fit w-1/2 overflow-x-clip rounded-t-lg px-1 py-1 sm:w-11/12 ${
        isMe
          ? `self-start rounded-r-lg bg-${colorString} bg-opacity-10`
          : "self-end rounded-l-lg bg-white"
      }`}
      key={message_id}
    >
      <p className="text-md overflow-ellipsis font-bold text-outerSpace-900">
        {user_name}
      </p>
      <p className="mb-2 mt-[-4px] text-xs font-light italic text-outerSpace-300">
        {date}
      </p>
      <p className="text-xs text-outerSpace-900">{text}</p>
    </div>
  );
};
