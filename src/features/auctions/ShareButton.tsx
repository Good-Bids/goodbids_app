import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useCreateShareLinkMutation,
  useShareLinkQuery,
} from "~/hooks/useShareLink";

interface ShareButtonProps {
  userId: string;
}

export const ShareButton = ({ userId }: ShareButtonProps) => {
  const { data: referralId } = useShareLinkQuery(userId);
  const createShareLink = useCreateShareLinkMutation({ userId });
  const [referralLink, setReferralLink] = useState<string>();

  useEffect(() => {
    if (window !== undefined && referralId !== undefined) {
      const basePath = window.location.origin;
      setReferralLink(`${basePath}/signUp?referralId=${referralId}`);
    }
  }, [referralId]);

  const copyToClipboard = async () => {
    if (referralLink === undefined) {
      return;
    }
    const type = "text/plain";
    const blob = new Blob([referralLink], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
  };

  return (
    <div className="mx-4 my-2 flex flex-col">
      {referralId && referralLink ? (
        <div className="flex w-full flex-col items-center rounded border-[1px] border-solid border-cw-blue p-1">
          <p className="text-xl font-bold text-cw-blue">
            🎉 Referral link created
          </p>
          <div onClick={copyToClipboard} className="flex flex-col items-center">
            <p className="text-[12px] font-light text-outerSpace-400">
              {referralLink}
            </p>
            <p className="cursor-pointer text-cw-blue">
              click here to copy to clipboard
            </p>
          </div>
        </div>
      ) : (
        <>
          <p>Click the button below to create a referral link.</p>
          <p>If two people sign up using your link, you'll earn a free bid!</p>
          <button
            className="container w-full rounded bg-green-500 py-2 text-xl font-bold text-white"
            onClick={() => createShareLink.mutateAsync()}
          >
            Create Referral Link
          </button>
        </>
      )}
    </div>
  );
};
