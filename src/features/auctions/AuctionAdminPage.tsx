/**
 * AuctionAdminPage
 *
 * once a user has the 'charityAdmin' role,
 * they can create auctions for their charity.
 *
 * The page requires a CHARITY_ID to be provided
 *
 * TODO: need to get a validation lib
 * and proper error correction and display
 *
 * #note: the policy in the auctions table designates
 * that the charity admin id matches the auth id. In the
 * charity admin table this is not the case.
 * I manually altered my charity admin id to match my user id
 * to make this work
 *
 */
import React from "react";
import { UpdateAuctionStateForm } from "~/components/AuctionUpdateStateForm";
import { UpdateAuctionForm } from "~/components/AuctionUpdateForm";

export const AuctionAdminPage = () => {
  return (
    <div className="flex flex-grow">
      <div className="p-1">
        <UpdateAuctionForm />
      </div>
      <div className="p-1">
        <UpdateAuctionStateForm />
      </div>
    </div>
  );
};
