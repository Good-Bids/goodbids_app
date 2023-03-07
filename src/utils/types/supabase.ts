export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      auction: {
        Row: {
          auction_id: string
          bids: string[]
          charity_id: string
          created_at: string | null
          description: string
          high_bid_value: number | null
          increment: number | null
          item_id: string
          minimum_bids: number | null
          name: string
          opening_bid_value: number
          status: string
          type: string
        }
        Insert: {
          auction_id: string
          bids?: string[]
          charity_id: string
          created_at?: string | null
          description: string
          high_bid_value?: number | null
          increment?: number | null
          item_id: string
          minimum_bids?: number | null
          name: string
          opening_bid_value: number
          status?: string
          type?: string
        }
        Update: {
          auction_id?: string
          bids?: string[]
          charity_id?: string
          created_at?: string | null
          description?: string
          high_bid_value?: number | null
          increment?: number | null
          item_id?: string
          minimum_bids?: number | null
          name?: string
          opening_bid_value?: number
          status?: string
          type?: string
        }
      }
      bid: {
        Row: {
          amount: number
          auction_id: string
          bid_id: string
          bidder_id: string
          charity_id: string
          created_at: string
        }
        Insert: {
          amount: number
          auction_id: string
          bid_id: string
          bidder_id: string
          charity_id: string
          created_at?: string
        }
        Update: {
          amount?: number
          auction_id?: string
          bid_id?: string
          bidder_id?: string
          charity_id?: string
          created_at?: string
        }
      }
      bidder: {
        Row: {
          auth_id: string
          bidder_id: string
          bids: number[]
          created_at: string | null
          email: string
          interactions: number[]
          name: string | null
        }
        Insert: {
          auth_id: string
          bidder_id: string
          bids: number[]
          created_at?: string | null
          email?: string
          interactions: number[]
          name?: string | null
        }
        Update: {
          auth_id?: string
          bidder_id?: string
          bids?: number[]
          created_at?: string | null
          email?: string
          interactions?: number[]
          name?: string | null
        }
      }
      bidder_auction_status: {
        Row: {
          auction_id: string
          bidder_id: string
          created_at: string
          early_free_bid: boolean
          high_bid: boolean
          many_free_bid: boolean
          partner_free_bid: boolean
          status_id: string
        }
        Insert: {
          auction_id: string
          bidder_id: string
          created_at?: string
          early_free_bid?: boolean
          high_bid?: boolean
          many_free_bid?: boolean
          partner_free_bid?: boolean
          status_id: string
        }
        Update: {
          auction_id?: string
          bidder_id?: string
          created_at?: string
          early_free_bid?: boolean
          high_bid?: boolean
          many_free_bid?: boolean
          partner_free_bid?: boolean
          status_id?: string
        }
      }
      charity: {
        Row: {
          auctions: string[]
          bidders: string[]
          charity_id: string
          created_at: string | null
          ein: string
          email: string
          items: string[]
          name: string
        }
        Insert: {
          auctions?: string[]
          bidders?: string[]
          charity_id: string
          created_at?: string | null
          ein: string
          email: string
          items?: string[]
          name: string
        }
        Update: {
          auctions?: string[]
          bidders?: string[]
          charity_id?: string
          created_at?: string | null
          ein?: string
          email?: string
          items?: string[]
          name?: string
        }
      }
      item: {
        Row: {
          auction_id: string | null
          charity_id: string
          created_at: string | null
          description: string
          item_id: string
          name: string
          value: number | null
        }
        Insert: {
          auction_id?: string | null
          charity_id: string
          created_at?: string | null
          description: string
          item_id: string
          name: string
          value?: number | null
        }
        Update: {
          auction_id?: string | null
          charity_id?: string
          created_at?: string | null
          description?: string
          item_id?: string
          name?: string
          value?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
