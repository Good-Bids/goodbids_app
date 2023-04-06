/**
 * File contains: 
 * 
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 * 
 */
import { Database } from "./supabase"

/** Convenience wrapper - from supabase.ts */
export type T_AuctionRowModel = Database['public']['Tables']['auction']['Row'];

export interface I_AuctionRowModel {
    auction: T_AuctionRowModel
}

export interface I_AuctionRowCollection {
    auctions: T_AuctionRowModel[] | []
}