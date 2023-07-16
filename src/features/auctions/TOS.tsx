import { useRouter } from "next/router";

export const TOS = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const terms = [
    `Goodbids does not charge a fee to anyone using this service, and all financial interactions that we facilitate are only between our users (the “bidders”) and charities like BuildOn (the “charities”).`,
    `This service is optimized for use in the United States, but you are welcome to use it anywhere that it is not regulated or prohibited. You must be 18 or older to use this site.`,
    `All taxes and tax deductions are the responsibility of the bidder.`,
    `Every bid made using GoodBids is a non-refundable donation to the charity, made via Paypal.`,
    `By donating to the charity, you agree to their terms, including issues of data usage and marketing.`,
    `When you use GoodBids, we’ll do our best to send you emails or other alerts when your bid is confirmed, when you are outbid and when the auction is about to end. It’s possible that technical issues will cause a problem, or that the emails will be filtered along the way, and you acknowledge that it’s your responsibility to monitor the auction in real time.`,
    `GoodBids isn’t responsible for any issues that lead to a bidder failing to be informed or not being awarded a prize. We’re here to facilitate fundraising for charities, and make no representations about adjudication of the bidding. We do, however, warrant that the prizes promised will be awarded. If, due to force majeure or unexpected events, the prize cannot be awarded, the high bidder will be given the option of receiving a refund for their last and highest bid.`,
    `All underbidders will receive a receipt from Paypal and the charity. Using this for a tax deduction is at the discretion of the bidder. Consult your accountant.`,
    `GoodBids promises that your activity on this site will be used only to improve our services and will not be sold or rented to any third party.`,
    `Thank you for caring, for participating and for making a difference.`,
  ];
  return (
    <div className="flex h-full w-full flex-col px-4 py-2">
      <div className="flex flex-col gap-2 py-8">
        <p className="text-4xl font-bold text-black">Terms of Service</p>
        <p className="text-outerspace-700 text-base">
          Thanks for participating in this experimental beta test of GoodBids, a
          project of Do You Zoom, Inc. By participating in the test, you
          acknowledge and agree to the following:
        </p>
      </div>
      <div className="h-full w-full overflow-auto px-4">
        <ol className="mx-4 list-decimal">
          {terms.map((term) => (
            <li className="mb-4">{term}</li>
          ))}
        </ol>
      </div>
      <button
        onClick={() => handleBackClick()}
        className="container bg-bo-red p-2 text-base font-bold text-white"
      >
        Okay
      </button>
    </div>
  );
};
