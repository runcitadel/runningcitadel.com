import * as cloudflare from "https://cdn.skypack.dev/cloudflare-client?dts";
import { Handlers } from "$fresh/server.ts";
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
  type: cloudflare.DnsRecordType;
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
  async GET(req, ctx) {
    const id = ctx.params.id;
    const authData = await validateAuthFromRequest(req);
    if (authData instanceof Response) {
      return authData;
    }
    const res = await cf.get(id);
    if (
      authData.domain !== res.name && !res.name.endsWith(`.${authData.domain}`)
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
  async PUT(req, ctx) {
    const id = ctx.params.id;
    const authData = await validateAuthFromRequest(req);
    if (authData instanceof Response) {
      return authData;
    }
    const rawBody = await req.json();
    const body = ensureNoInvalidProps<DnsRecordInput>(rawBody, [
      "type",
      "content",
      "ttl",
      "priority",
    ], ["type", "content", "ttl"]);
    if (body instanceof Response) {
      return body;
    }
    // Get the ID first and ensure user has perms
    const res = await cf.get(id);
    if (
      authData.domain !== res.name && !res.name.endsWith(`.${authData.domain}`)
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
    const updateRes = await cf.update(id, {...res, ...body, name: res.name});
    return new Response(JSON.stringify(updateRes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
  async DELETE(req, ctx) {
    const id = ctx.params.id;
    const authData = await validateAuthFromRequest(req);
    if (authData instanceof Response) {
      return authData;
    }
    const res = await cf.get(id);
    if (
      authData.domain !== res.name && !res.name.endsWith(`.${authData.domain}`)
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
    await cf.delete(id);
    return new Response(null, { status: 204 });
  }
};
