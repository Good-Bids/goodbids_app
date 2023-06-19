import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCommentsMutation } from "~/hooks/useComment";
import { useUserName } from "~/hooks/useUserName";

export const CommentInput = (props: { auctionId: string }) => {
  const { auctionId } = props;
  const router = useRouter();
  const { name: userName, id: userId } = useUserName();
  const [message, setMessage] = useState<string>();

  const { register, handleSubmit } = useForm();
  const mutation = useCommentsMutation({
    auctionId,
    user: userId,
    user_name: userName,
    text: message ?? "",
  });

  return userName !== "anonymous" ? (
    <form
      className="mx-4 flex flex-col gap-1 py-6"
      onSubmit={handleSubmit(async (data) => {
        try {
          if (data.message) {
            setMessage(data.message);
            await mutation.mutateAsync();
            router.reload();
          }
        } catch (error) {
          window.alert(error);
        }
      })}
    >
      <textarea
        placeholder="write your message here..."
        className="px-3 py-3"
        {...register("message")}
      />
      <label
        className={`flex flex-col justify-center rounded-md border-[1px] border-solid border-outerSpace-100 px-4 py-1`}
      >
        <svg
          width="24"
          height="25"
          className="mb-[-24px] mr-[-46px] self-center"
        >
          <path
            d="M5.69362 12.3528L2.29933 3.62465C2.0631 3.01718 2.65544 2.43624 3.2414 2.64274L3.33375 2.68199L21.3337 11.682C21.852 11.9411 21.8844 12.6506 21.4309 12.9661L21.3337 13.0236L3.33375 22.0236C2.75077 22.3151 2.11746 21.7791 2.2688 21.1766L2.29933 21.081L5.69362 12.3528L2.29933 3.62465L5.69362 12.3528ZM4.4021 4.89322L7.01109 11.6022L13.6387 11.6028C14.0184 11.6028 14.3322 11.885 14.3818 12.251L14.3887 12.3528C14.3887 12.7325 14.1065 13.0463 13.7404 13.096L13.6387 13.1028L7.01109 13.1022L4.4021 19.8124L19.3213 12.3528L4.4021 4.89322Z"
            fill="#003366"
          />
        </svg>
        <input
          type="submit"
          value="Send      "
          className="w-full font-bold text-cw-blue"
        />
      </label>
    </form>
  ) : (
    <></>
  );
};
