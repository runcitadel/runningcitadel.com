import { HandlerContext, Handlers } from "$fresh/server.ts";
import supabase from "/utils/supabase.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const subdomain = ctx.params.slug as string;
    const {count, error} = await supabase.from("subdomains").select("*", { count: "exact", head: true }).eq("domain", subdomain);
    if (error) {
      console.error(error);
      return new Response(error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ available: count === 0 }), { status: 200, headers: { "Content-Type": "application/json" } });
  },
};
