interface ShareButtonProps {
  userId: string;
}

export const ShareButton = ({ userId }: ShareButtonProps) => {
  return (
    <div className="mx-4 my-2 flex flex-col">
      <p>Click the button below to create a referral link.</p>
      <p>If two people sign up using your link, you'll earn a free bid!</p>
      <button className="container w-full rounded bg-green-500 py-2 text-xl font-bold text-white">
        Create Referral Link
      </button>
    </div>
  );
};
