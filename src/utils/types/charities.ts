/**
 * File contains:
 *
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 *
 */

import { Database } from "./supabase";

/** Convenience wrappers - from supabase.ts */
export type Charity = Database["public"]["Tables"]["charity"]["Row"];
export type CharityInsert = Database["public"]["Tables"]["charity"]["Insert"]; // includes all schema

export interface CreateCharityFormValues {
  email: string;
  ein: string;
  name: string;
  adminId: string;
}
