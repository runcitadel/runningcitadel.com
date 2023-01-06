import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import { createClient, SupabaseClient } from "https://cdn.skypack.dev/@supabase/supabase-js?dts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Database } from "./db.ts";

let client: SupabaseClient<Database> | null = null;
if (IS_BROWSER) {
    console.warn("Supabase module imported in browser");
} else {
    installGlobals();
    client = createClient<Database>(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ADMIN_KEY")!);
    
}
export default client as SupabaseClient<Database>;
