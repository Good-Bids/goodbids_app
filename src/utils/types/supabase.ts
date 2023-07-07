export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
        Relationships: [
          {
            foreignKeyName: "auction_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity"
            referencedColumns: ["charity_id"]
          },
          {
            foreignKeyName: "auction_item_id_fkey"
            columns: ["item_id"]
            referencedRelation: "item"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "auction_latest_bidder_id_fkey"
            columns: ["latest_bidder_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      auction_comment: {
        Row: {
          auction: string
          created_at: string
          id: number
          message_id: string
          text: string
          user: string
          user_name: string
        }
        Insert: {
          auction: string
          created_at?: string
          id?: number
          message_id?: string
          text: string
          user: string
          user_name?: string
        }
        Update: {
          auction?: string
          created_at?: string
          id?: number
          message_id?: string
          text?: string
          user?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "auction_comment_auction_fkey"
            columns: ["auction"]
            referencedRelation: "auction"
            referencedColumns: ["auction_id"]
          },
          {
            foreignKeyName: "auction_comment_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "bid_auction_id_fkey"
            columns: ["auction_id"]
            referencedRelation: "auction"
            referencedColumns: ["auction_id"]
          },
          {
            foreignKeyName: "bid_bidder_id_fkey"
            columns: ["bidder_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity"
            referencedColumns: ["charity_id"]
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "charity_admin_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity"
            referencedColumns: ["charity_id"]
          },
          {
            foreignKeyName: "charity_admin_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      free_bids: {
        Row: {
          auction_id: string
          bidder_id: string
          created_at: string | null
          free_bid_id: string
          free_bid_type: string | null
          status: string
        }
        Insert: {
          auction_id: string
          bidder_id: string
          created_at?: string | null
          free_bid_id?: string
          free_bid_type?: string | null
          status?: string
        }
        Update: {
          auction_id?: string
          bidder_id?: string
          created_at?: string | null
          free_bid_id?: string
          free_bid_type?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_bids_auction_id_fkey"
            columns: ["auction_id"]
            referencedRelation: "auction"
            referencedColumns: ["auction_id"]
          },
          {
            foreignKeyName: "free_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "item_auction_id_fkey"
            columns: ["auction_id"]
            referencedRelation: "auction"
            referencedColumns: ["auction_id"]
          },
          {
            foreignKeyName: "item_charity_id_fkey"
            columns: ["charity_id"]
            referencedRelation: "charity"
            referencedColumns: ["charity_id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "bidder_auth_id_fkey"
            columns: ["auth_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_referrals: {
        Row: {
          created_at: string | null
          has_placed_bid: boolean
          id: number
          new_user_id: string | null
          referral_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          has_placed_bid?: boolean
          id?: number
          new_user_id?: string | null
          referral_id?: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          has_placed_bid?: boolean
          id?: number
          new_user_id?: string | null
          referral_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_referrals_new_user_id_fkey"
            columns: ["new_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
