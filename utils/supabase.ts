import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js?dts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Database } from "./db.ts";

installGlobals();

if (IS_BROWSER) {
    throw new Error("This module is not intended for use in the browser.");
}
const client = createClient<Database>(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ADMIN_KEY")!);
export default client;