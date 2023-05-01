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
          bid_currency: string | null
          charity_id: string
          created_at: string | null
          description: string
          high_bid_value: number
          increment: number
          item_id: string | null
          latest_bid_timestamptz: string | null
          latest_bidder_id: string | null
          minimum_bids: number | null
          name: string
          opening_bid_value: number
          over_bid_good_time_active: boolean | null
          over_bid_good_time_early_fee: number | null
          over_bid_good_time_late_fee: number | null
          over_bid_good_time_often_fee: number | null
          over_bid_good_time_threshold_field: Json | null
          status: string
          top_bid_duration: number
          type: string
        }
        Insert: {
          auction_id?: string
          bid_currency?: string | null
          charity_id: string
          created_at?: string | null
          description: string
          high_bid_value: number
          increment?: number
          item_id?: string | null
          latest_bid_timestamptz?: string | null
          latest_bidder_id?: string | null
          minimum_bids?: number | null
          name: string
          opening_bid_value: number
          over_bid_good_time_active?: boolean | null
          over_bid_good_time_early_fee?: number | null
          over_bid_good_time_late_fee?: number | null
          over_bid_good_time_often_fee?: number | null
          over_bid_good_time_threshold_field?: Json | null
          status?: string
          top_bid_duration?: number
          type?: string
        }
        Update: {
          auction_id?: string
          bid_currency?: string | null
          charity_id?: string
          created_at?: string | null
          description?: string
          high_bid_value?: number
          increment?: number
          item_id?: string | null
          latest_bid_timestamptz?: string | null
          latest_bidder_id?: string | null
          minimum_bids?: number | null
          name?: string
          opening_bid_value?: number
          over_bid_good_time_active?: boolean | null
          over_bid_good_time_early_fee?: number | null
          over_bid_good_time_late_fee?: number | null
          over_bid_good_time_often_fee?: number | null
          over_bid_good_time_threshold_field?: Json | null
          status?: string
          top_bid_duration?: number
          type?: string
        }
      }
      bid: {
        Row: {
          auction_id: string
          bid_id: string
          bid_status: string
          bid_value: number
          bidder_id: string
          charity_id: string
          created_at: string
        }
        Insert: {
          auction_id: string
          bid_id?: string
          bid_status?: string
          bid_value: number
          bidder_id: string
          charity_id: string
          created_at?: string
        }
        Update: {
          auction_id?: string
          bid_id?: string
          bid_status?: string
          bid_value?: number
          bidder_id?: string
          charity_id?: string
          created_at?: string
        }
      }
      bid_state: {
        Row: {
          auction_id: string
          created_at: string
          status: string
          ttl: number
        }
        Insert: {
          auction_id: string
          created_at?: string
          status?: string
          ttl?: number
        }
        Update: {
          auction_id?: string
          created_at?: string
          status?: string
          ttl?: number
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
          charity_id: string
          created_at: string | null
          description_body: string
          description_header: string
          ein: string
          email: string
          name: string
          status: string
        }
        Insert: {
          charity_id?: string
          created_at?: string | null
          description_body?: string
          description_header?: string
          ein: string
          email: string
          name: string
          status?: string
        }
        Update: {
          charity_id?: string
          created_at?: string | null
          description_body?: string
          description_header?: string
          ein?: string
          email?: string
          name?: string
          status?: string
        }
      }
      charity_admin: {
        Row: {
          charity_admin_id: string
          charity_id: string | null
          created_at: string | null
          is_charity_admin: boolean | null
          user_id: string
        }
        Insert: {
          charity_admin_id?: string
          charity_id?: string | null
          created_at?: string | null
          is_charity_admin?: boolean | null
          user_id: string
        }
        Update: {
          charity_admin_id?: string
          charity_id?: string | null
          created_at?: string | null
          is_charity_admin?: boolean | null
          user_id?: string
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
          item_id?: string
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
      user: {
        Row: {
          auth_id: string
          bidder_id: string
          created_at: string | null
          email: string
          is_charity_admin: boolean
          name: string | null
        }
        Insert: {
          auth_id: string
          bidder_id?: string
          created_at?: string | null
          email?: string
          is_charity_admin?: boolean
          name?: string | null
        }
        Update: {
          auth_id?: string
          bidder_id?: string
          created_at?: string | null
          email?: string
          is_charity_admin?: boolean
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_auction_sql: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
