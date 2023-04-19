import {
  preflightValidateBidAmount,
  addBidLock,
  addBid,
  updateAuctionWithBid,
  updateBidCompleteStatus,
  removeBidLockByAuctionId,
} from "~/hooks/useAuction";

import { Auction } from "~/utils/types/auctions";

interface I_BidHandler {
  userId: string;
  auction: Auction;
  bidValue: number;
  onStartCB: Function;
  onCompleteCB: Function;
  onErrorCD: Function;
}

/**
 * bidHandler
 *
 * async
 *
 * @param userId string - userId from supabase JWT
 * @param auction object - full I_AuctionModel
 * @param bidValue number - what you want to bid
 * @param onStartCB function - on start hook
 * @param onCompleteCB function - on complete hook
 * @param onErrorCD function  - on error hook
 * @returns
 */
export const bidHandler = async (
  userId: string,
  auction: Auction,
  bidValue: number,
  onStartCB: Function,
  onCompleteCB: Function,
  onErrorCD: Function
) => {
  // insert Start CB hook in case needed by parent
  onStartCB();

  // Double check the validity of the bid amount
  const preFlightCheckResult = await preflightValidateBidAmount(
    auction.auction_id,
    auction.increment,
    bidValue
  );

  console.log("[Process BID] - PreFlight Bid Check ", preFlightCheckResult);

  // Bid amount is valid lock it in on the Bid_Status table
  const bidLockedResult = await addBidLock(auction.auction_id);

  // add the bid to the Bid table as PENDING
  const updateBidTableResults = await addBid(
    auction.auction_id,
    auction.charity_id,
    userId,
    bidValue
  );

  console.log(
    "[Process BID] - Add bid to bid table as PENDING ",
    updateBidTableResults
  );

  // add the current bid value to the Auctions table
  const updateAuctionResults = await updateAuctionWithBid(
    auction.auction_id,
    bidValue
  );
  console.log(
    "[Process BID] - Update the auction table ",
    updateAuctionResults
  );

  // Change Bid Table status to COMPLETE
  const bidCompletedResults = await updateBidCompleteStatus(
    updateBidTableResults.bid[0].bid_id
  );

  console.log("[Process BID] - Update the bid table ", bidCompletedResults);

  // Unlock the bidding by removing the bid_status row
  const unlockBidResults = await removeBidLockByAuctionId(auction.auction_id);
  console.log("[Process BID] - Unlock the bid process ", unlockBidResults);

  // insert Start CB hook in case needed by parent
  onCompleteCB();

  return {
    status: {
      message: "[Process BID] - post bid log",
      successful: true,
      hasError: false,
      rawError: null,
    },
  };
};
