/**
 * File contains:
 *
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 *
 */
import { Database } from "./supabase";

/** Convenience wrapper - from supabase.ts */
export type Auction = Database["public"]["Tables"]["auction"]["Row"];
export type Bid = Database["public"]["Tables"]["bid"]["Row"];
export type BidState = Database["public"]["Tables"]["bid_state"];

export interface AuctionExtended extends Auction {
  bids: Bid[] | Bid | null;
}
