import { useUserQuery } from "~/hooks/useUser";

interface Comment {
  text: string;
  user: string;
  user_name: string;
  message_id: string;
}

export const CommentBubble = ({
  user,
  text,
  user_name,
  message_id,
}: Comment) => {
  const { data: currentUser } = useUserQuery();
  const isMe = currentUser?.id === user;
  return (
    <div
      className={`h-fit w-1/2 overflow-clip rounded-t-lg px-1 py-1 md:w-5/6  ${
        isMe
          ? "self-start rounded-r-lg bg-cw-blue bg-opacity-10"
          : "self-end rounded-l-lg bg-white"
      }`}
      key={message_id}
    >
      <p className="overflow-ellipsis text-base font-bold text-outerSpace-900">
        {user_name}
      </p>
      <p className="text-base text-outerSpace-900">{text}</p>
    </div>
  );
};
