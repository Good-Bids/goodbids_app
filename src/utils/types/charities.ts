/**
 * File contains:
 *
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 *
 */

import { Database } from "./supabase";

/** Convenience wrappers - from supabase.ts */
export type T_CharityModel = Database["public"]["Tables"]["charity"]["Row"];
export type T_NewCharityModel =
  Database["public"]["Tables"]["charity"]["Insert"]; // includes all schema

export interface I_CharityModel {
  charity: T_CharityModel;
}

export interface I_CharityCollection {
  charities: T_CharityModel[] | [];
}

export interface I_CreateCharityFormValues {
  email: string;
  ein: string;
  name: string;
  adminId: string;
}
