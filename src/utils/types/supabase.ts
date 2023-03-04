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
          bids: number[]
          charity: number
          created_at: string | null
          description: string
          high_bid_value: number | null
          id: number
          increment: number | null
          interactions: number[]
          item: number | null
          minimum_bids: number | null
          name: string
          opening_bid_value: number
          status: string
          type: string
        }
        Insert: {
          bids: number[]
          charity: number
          created_at?: string | null
          description: string
          high_bid_value?: number | null
          id?: number
          increment?: number | null
          interactions: number[]
          item?: number | null
          minimum_bids?: number | null
          name: string
          opening_bid_value: number
          status?: string
          type?: string
        }
        Update: {
          bids?: number[]
          charity?: number
          created_at?: string | null
          description?: string
          high_bid_value?: number | null
          id?: number
          increment?: number | null
          interactions?: number[]
          item?: number | null
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
          auction: number
          bidder: number
          created_at: string
          id: number
          item: number
        }
        Insert: {
          amount: number
          auction: number
          bidder: number
          created_at?: string
          id?: number
          item: number
        }
        Update: {
          amount?: number
          auction?: number
          bidder?: number
          created_at?: string
          id?: number
          item?: number
        }
      }
      bidder: {
        Row: {
          bids: number[]
          created_at: string | null
          email: string
          id: number
          interactions: number[]
          name: string | null
        }
        Insert: {
          bids: number[]
          created_at?: string | null
          email?: string
          id?: number
          interactions: number[]
          name?: string | null
        }
        Update: {
          bids?: number[]
          created_at?: string | null
          email?: string
          id?: number
          interactions?: number[]
          name?: string | null
        }
      }
      bidder_auction_status: {
        Row: {
          auction: number
          bidder: number
          created_at: string
          early_free_bid: boolean
          high_bid: boolean
          id: number
          many_free_bid: boolean
          partner_free_bid: boolean
        }
        Insert: {
          auction: number
          bidder: number
          created_at?: string
          early_free_bid?: boolean
          high_bid?: boolean
          id?: number
          many_free_bid?: boolean
          partner_free_bid?: boolean
        }
        Update: {
          auction?: number
          bidder?: number
          created_at?: string
          early_free_bid?: boolean
          high_bid?: boolean
          id?: number
          many_free_bid?: boolean
          partner_free_bid?: boolean
        }
      }
      bidder_interaction: {
        Row: {
          auction: number | null
          bidder: number | null
          charity: number | null
          created_at: string | null
          id: number
          interaction_detail: string | null
          interaction_type: string
          interactor: number
          item: number | null
        }
        Insert: {
          auction?: number | null
          bidder?: number | null
          charity?: number | null
          created_at?: string | null
          id?: number
          interaction_detail?: string | null
          interaction_type?: string
          interactor: number
          item?: number | null
        }
        Update: {
          auction?: number | null
          bidder?: number | null
          charity?: number | null
          created_at?: string | null
          id?: number
          interaction_detail?: string | null
          interaction_type?: string
          interactor?: number
          item?: number | null
        }
      }
      charity: {
        Row: {
          bidders: number[]
          created_at: string | null
          ein: string
          email: string
          events: number[]
          id: number
          items: number[]
          name: string
        }
        Insert: {
          bidders: number[]
          created_at?: string | null
          ein: string
          email: string
          events: number[]
          id?: number
          items: number[]
          name: string
        }
        Update: {
          bidders?: number[]
          created_at?: string | null
          ein?: string
          email?: string
          events?: number[]
          id?: number
          items?: number[]
          name?: string
        }
      }
      charity_interaction: {
        Row: {
          auction: number | null
          bidder: number | null
          charity: number | null
          created_at: string | null
          id: number
          interaction_detail: string | null
          interaction_type: string
          interactor: number
          item: number | null
        }
        Insert: {
          auction?: number | null
          bidder?: number | null
          charity?: number | null
          created_at?: string | null
          id?: number
          interaction_detail?: string | null
          interaction_type?: string
          interactor: number
          item?: number | null
        }
        Update: {
          auction?: number | null
          bidder?: number | null
          charity?: number | null
          created_at?: string | null
          id?: number
          interaction_detail?: string | null
          interaction_type?: string
          interactor?: number
          item?: number | null
        }
      }
      item: {
        Row: {
          charity: number
          created_at: string | null
          description: string
          event: number | null
          id: number
          name: string
          value: number | null
        }
        Insert: {
          charity: number
          created_at?: string | null
          description: string
          event?: number | null
          id?: number
          name: string
          value?: number | null
        }
        Update: {
          charity?: number
          created_at?: string | null
          description?: string
          event?: number | null
          id?: number
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
