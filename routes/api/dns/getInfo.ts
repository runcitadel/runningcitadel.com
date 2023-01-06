import { HandlerContext } from "$fresh/server.ts";
import { validateAuthFromRequest } from "/utils/domain.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  const validated = await validateAuthFromRequest(req);
  if (validated instanceof Response) {
    return validated;
  } else {
    return new Response(JSON.stringify(validated), { status: 200, headers: { "Content-Type": "application/json" } });
  }
};
