import * as cloudflare from "https://cdn.skypack.dev/cloudflare-client?dts";
import { Handlers } from "$fresh/server.ts";
import { DnsRecordType } from "https://cdn.skypack.dev/cloudflare-client?dts";
import { validateAuthFromRequest } from "/utils/domain.ts";
import { ensureNoInvalidProps } from "/utils/validateBody.ts";

const cf = cloudflare.dnsRecords({
  zoneId: Deno.env.get("CLOUDFLARE_ZONE_ID")!,
  accessToken: Deno.env.get("CLOUDFLARE_API_TOKEN")!,
});

type DnsRecordInput = {
    /**
     * DNS record type
     * @example "A"
     */
    type: DnsRecordType;
    /**
     * DNS record name (`max length: 255`)
     * @example "example.com"
     */
    name: string;
    /**
     * DNS record content
     * @example "127.0.0.1"
     */
    content: string;
    /**
     * Time to live, in seconds, of the DNS record.
     * Must be between `60` and `86400`, or `1` for `automatic`.
     * @example 3600
     */
    ttl: number;
    /**
     * Required for MX, SRV and URI records; unused by other record types.
     * Records with lower priorities are preferred.
     * @example: 10
     */
    priority?: number;
};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const authData = await validateAuthFromRequest(req);
    if (authData instanceof Response) {
      return authData;
    }
    const rawBody = await req.json();
    const body = ensureNoInvalidProps<DnsRecordInput>(rawBody, [
        "type",
        "name",
        "content",
        "ttl",
        "priority",
    ], ["type", "name", "content", "ttl"]);
    if (body instanceof Response) {
      return body;
    }
    // Ensure user has access to body.name
    if (authData.domain !== body.name && !body.name.endsWith(`.${authData.domain}`)) {
      return new Response(`Your domain needs to be a subdomain of ${authData.domain}.runningcitadel.com. ${body.name}.runningcitadel.com is not a subdomain of ${authData.domain}.runningcitadel.com.`, { status: 401 });
    }
    const res = await cf.create(body);
    return new Response(JSON.stringify(res), { status: 200, headers: { "Content-Type": "application/json" } });
  },
};
