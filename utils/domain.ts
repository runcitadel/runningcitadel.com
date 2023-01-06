import supabase from "./supabase.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const reservedNames = [
  "aaron",
  "citadel",
  "dtvelectronics",
  "runcitadel",
  "aarondewes",
  "bitcoin",
  "lightning",
];

export async function validateAuth(username: string, password: string) {
  const { data, error } = await supabase
    .from("subdomains")
    .select()
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.error(error);
    return false;
  }
  if (!data) {
    return false;
  }
  return bcrypt.compareSync(password, data.hashed_secret) ? data : false;
}
