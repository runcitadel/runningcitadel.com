import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getLogger } from "https://deno.land/x/fresh_logging@1.1.2/index.ts";
export const handler = [
  getLogger(),
  async (
    req: Request,
    ctx: MiddlewareHandlerContext,
  ) => {
    const resp = await ctx.next();
    if (req.url.startsWith("https://")) {
      resp.headers.set("Strict-Transport-Security", "max-age=94608000; includeSubDomains; preload");
    }
    return resp;
  }
];
