import { CfTurnstileValidationResult } from "$turnstile/handlers/CfTurnstileValidation.ts";
import { Handlers } from "$fresh/server.ts";
import supabase from "/utils/supabase.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Head } from "$fresh/runtime.ts";

const secretKey = Deno.env.get("TURNSTITLE_SERVER_KEY")!;

const reservedNames = [
    "developers",
    "citadel",
    "dtvelectronics",
    "umbrel"
];

export const handler: Handlers = {
  async POST(req, ctx) {
    const body = await req.formData();
    // Turnstile injects a token in "cf-turnstile-response".
    const token = body.get("cf-turnstile-response");
    const ip = (ctx.remoteAddr as Deno.NetAddr).hostname;
    if (!token || !secretKey) return new Response("Missing captcha", {
        status: 400
    });

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    });

    const outcome: CfTurnstileValidationResult = await result.json();

    if (outcome.success) {
        const username = body.get("username");
        const password = body.get("password");
        const subdomain = body.get("subdomain");
        if (typeof username !== "string" || typeof password !== "string" || typeof subdomain !== "string") {
            return new Response("Bad request", {
                status: 400
            });
        }
        if (subdomain.length < 5 || reservedNames.includes(subdomain) || !subdomain.match(/^[a-z0-9]+$/) || subdomain.length > 20) {
            return new Response("Invalid subdomain", {
                status: 400
            });
        }
        await supabase.from("subdomains").insert({
            username,
            hashed_secret: await bcrypt.hash(password),
            domain: subdomain,
        });
    } else {
        if (!token || !secretKey) return new Response("Failed to pass captcha", {
            status: 400
        });
    }
    return ctx.render();
  },
};

export default function SuccessPage() {
    return (
        <>
          <Head>
            <title>Subdomain set up</title>
          </Head>
          <div class="dark:bg-gray-800 dark:text-white min-h-screen">
            <div class="min-h-screen flex items-center justify-center flex-col">
              <h1 class="text-7xl font-semibold tracking-tight leading-none md:text-8xl xl:text-9xl mb-4">
                Your subdomain is set up!
              </h1>
              <p>
                You can now continue the setup on your node.
              </p>
            </div>
          </div>
        </>
      );
}
