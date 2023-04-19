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

/**
 * Nested Types from Supabase require over rides in the return ( a cast )
 * or make a new model manually. Probably the commented out cast in the useAuction
 * getAuctions is possible.
 */

export interface AuctionExtended extends Auction {
  bids: Bid[] | Bid | null;
}
