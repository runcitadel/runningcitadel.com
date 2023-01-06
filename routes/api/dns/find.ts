import * as cloudflare from "https://cdn.skypack.dev/cloudflare-client?dts";
import { Handlers } from "$fresh/server.ts";
import { DnsRecordType } from "https://cdn.skypack.dev/cloudflare-client?dts";
import { validateAuthFromRequest } from "/utils/domain.ts";
import { ensureNoInvalidProps } from "/utils/validateBody.ts";

const cf = cloudflare.dnsRecords({
  zoneId: Deno.env.get("CLOUDFLARE_ZONE_ID")!,
  accessToken: Deno.env.get("CLOUDFLARE_API_TOKEN")!,
});

type FindOptions = {
  /**
   * Whether to match all search requirements or at least one (`any`)
   * @default "all"
   */
  match?: "all" | "any";
  /**
   * DNS record name (`max length: 255`)
   * @example "example.com"
   */
  name: string;
  /**
   * Field to order records by
   */
  order?: "type" | "name" | "content" | "ttl" | "proxied";
  /**
   * Page number of paginated results
   * @default 1
   */
  page?: number;
  /**
   * Number of DNS records per page (`min: 5`, `max: 5000`)
   * @default 100
   */
  perPage?: number;
  /**
   * DNS record content
   * @example "127.0.0.1"
   */
  content?: string;
  /**
   * DNS record type
   * @example "A"
   */
  type?: DnsRecordType;
  /**
   * Direction to order domains
   */
  direction?: "asc" | "desc";
};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const authData = await validateAuthFromRequest(req);
    if (authData instanceof Response) {
      return authData;
    }
    const rawBody = await req.json();
    const body = ensureNoInvalidProps<FindOptions>(rawBody, [
      "match",
      "name",
      "order",
      "page",
      "perPage",
      "content",
      "type",
      "direction",
    ], ["name"]);
    if (body instanceof Response) {
      return body;
    }
    // Ensure user has access to body.name
    if (authData.domain !== body.name && !body.name.endsWith(`.${authData.domain}`)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const res = await cf.find(body);
    const result = await res.all();
    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  },
};
