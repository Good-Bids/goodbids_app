const TermsOfServicePage = () => {
  return (
    <div className="top-[72px] flex h-fit w-full flex-col items-start justify-center gap-2 px-4 py-2 text-bottleGreen">
      <h1 className=" text-4xl font-black text-bottleGreen">
        Terms of Service for GOODBIDS
      </h1>
      <ol className="list-decimal">
        <li className="mt-2">
          <h2 className="text-xl font-bold text-bottleGreen">Introduction</h2>
          <p className="mx-2 text-bottleGreen">
            This document outlines the Terms of Service (the "Terms") for using
            the web tool operated by GOODBIDS, INC. The tool facilitates
            auctions organized by various non-profit entities ("NON-PROFITS")
            for fundraising purposes, where individuals ("USERS") can make
            donations and potentially earn rewards.
            <br />
            Each bid is a non-refundable donation. The highest donation to each
            auction receives a reward.
            <br />
            GOODBIDS is not a game of chance. Instead, the reward simply goes to
            the highest bidder. If someone bids just before an auction ends, the
            auction is extended.
            <br />
            All bids go directly to the charity that is the beneficiary of the
            auction. The NON-PROFITS pay a 10% fee to use this service, after
            the auction is complete.
            <br />
          </p>
        </li>
        <li className="mt-2">
          <h2 className="text-xl font-bold text-bottleGreen">
            Non-Profit Representations
          </h2>
          <p className="mx-2 text-bottleGreen">
            NON-PROFITS confirm they are authorized to raise funds via
            donations. The person using the site on behalf of the NON-PROFIT is
            duly authorized to act on their behalf. All representations made in
            the auctions are true and accurate to the best of the lister's
            knowledge. Any entity listing as a fundraising non-profit on our
            site warrants that they are a 501 3(c) registered charity, in good
            standing with the IRS, and that the representations they make in
            their listing are accurate. Charities will use their best efforts to
            deliver the rewards as described, and the sole recourse for
            non-delivery of a prize is that the high bidder will have the final
            bid refunded.
          </p>
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            Brand Representations
          </h2>
          <p className="mx-2 text-bottleGreen">
            From time to time, rewards will be sponsored by a brand. The
            companies providing these rewards agree to be held to the same
            representations as the NON-PROFITS.
          </p>
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            GOODBIDS Disclaimer: Bid at your own risk
          </h2>
          <p>
            The software is provided "as is" and GOODBIDS aims for optimal
            performance but is not liable for any interruptions or issues.
            GOODBIDS is not responsible for lost bids or undelivered items.
            GOODBIDS is not responsible for any harm caused by the reward as
            delivered.
          </p>
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">User Agreement</h2>
          <p>
            All bids are non-refundable donations to the NON-PROFITS, with no
            refunds except as outlined below. The benefit of bidding is in the
            philanthropic support of the NON-PROFIT and the tax deduction
            received, if any. If a NON-PROFIT cannot deliver a promised reward
            to the top donating user, they agree to refund the value of the
            winning bid if requested. USERs are responsible for all costs of
            delivery to receive a reward, and are responsible for taxes, if any.
          </p>
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            General Restrictions
          </h2>
          <ul className="mx-4 list-disc">
            <li>Use of the site is void where prohibited.</li>
            <li>Users must be over 18 years of age.</li>
            <li>Any user can be barred from using the site at any time.</li>
            <li>
              A user who violates these terms of service or any policies of
              GOODBIDS can be barred from all auctions going forward.
            </li>
          </ul>
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            Referral and Free Bids:
          </h2>
          Users can earn free bids through a referral link as per the free bids
          agreement and terms. Violation of these terms results in loss of free
          bids and possibly being barred from the site. These decisions can be
          made unilaterally by GOODBIDS at any time.
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            Auction Listings Disclaimer
          </h2>
          GOODBIDS hosts auctions but makes no warranties or representations
          regarding their accuracy.
        </li>
        <li>
          <h2 className="text-xl font-bold text-bottleGreen">
            Bid Processing and Tax Considerations
          </h2>
          Each bid is directly contributed to the NON-PROFIT, and USERS receive
          a receipt from them. Tax deductions are the USER's responsibility and
          GOODBIDS makes no promises regarding tax liability.
        </li>
        <li>
          <p className="font-bold text-bottleGreen">
            By using the site and its tools, USERS and NON-PROFITS agree to
            these Terms of Service.
          </p>
        </li>
      </ol>
    </div>
  );
};

export default TermsOfServicePage;
