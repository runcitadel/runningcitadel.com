import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext,
  ) {
    const resp = await ctx.next();
    if (req.url.startsWith("https://")) {
      resp.headers.set("Strict-Transport-Security", "max-age=94608000; includeSubDomains; preload");
    }
    return resp;
  }
  