import { useUserQuery } from "~/hooks/useUser";

interface Comment {
  text: string;
  user: string;
  user_name: string;
}

export const CommentBubble = ({ user, text, user_name }: Comment) => {
  const { data: currentUser } = useUserQuery();
  const isMe = currentUser?.id === user;
  return (
    <div
      className={`h-fit w-1/2  rounded-t-lg px-1 py-1 ${
        isMe
          ? "self-start rounded-r-lg bg-cw-blue bg-opacity-10"
          : "self-end rounded-l-lg bg-white"
      }`}
      key={user + text}
    >
      <p className="text-base font-bold text-outerSpace-900">{user_name}</p>
      <p className="text-base text-outerSpace-900">{text}</p>
    </div>
  );
};
