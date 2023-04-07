/**
 * File contains: 
 * 
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 * 
 */

import { Database } from "./supabase"

/** Convenience wrappers - from supabase.ts */
export type T_CharityModel = Database['public']['Tables']['charity']['Row'];
export type T_NewCharityModel = Database['public']['Tables']['charity']['Insert']; // includes all schema

export interface I_CharityModel {
    charity: T_CharityModel
}

export interface I_CharityCollection {
    charities: T_CharityModel[] | []
}

/**
 * I_NewCharityModel
 * 
 * charity_id?: string         // should be null since we autoGenerate the create date
 * created_at?: string | null  // should be null since we autoGenerate the create date
 * ein: string                 // mandatory ? USA registered charity ID ( from charity 3rd party api call )
 * email: string               // mandatory, charities main contact email ?
 * name: string                // mandatory, alpha numeric possibly some special chars display name
 * status?: string             // should be an enum currently only "PENDING" is Official ( I used ACTIVE )
 */
export interface I_NewCharityModel {
    charity: T_NewCharityModel
}