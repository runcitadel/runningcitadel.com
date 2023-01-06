import { CfTurnstileValidationResult } from "$turnstile/handlers/CfTurnstileValidation.ts";
import { Handlers } from "$fresh/server.ts";
import supabase from "/utils/supabase.ts";
import { reservedNames } from "/utils/domain.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Head } from "$fresh/runtime.ts";

const secretKey = Deno.env.get("TURNSTITLE_SERVER_KEY")!;

export const handler: Handlers = {
  async POST(req, ctx) {
    const body = await req.formData();
    // Turnstile injects a token in "cf-turnstile-response".
    const token = body.get("cf-turnstile-response");
    const ip = (ctx.remoteAddr as Deno.NetAddr).hostname;
    if (!token || !secretKey) {
      return new Response("Missing captcha", {
        status: 400,
      });
    }

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
      if (
        typeof username !== "string" || typeof password !== "string" ||
        typeof subdomain !== "string"
      ) {
        return new Response("Bad request", {
          status: 400,
        });
      }
      if (
        subdomain.length < 5 || reservedNames.includes(subdomain) ||
        !subdomain.match(/^[a-z0-9]+$/) || subdomain.length > 20
      ) {
        return new Response("Invalid subdomain", {
          status: 400,
        });
      }
      if (
        !username.match(/^([a-f0-9]){64}$/) ||
        !password.match(/^([a-f0-9]){64}$/)
      ) {
        return new Response(
          "Please make sure you copy your login data exactly from Citadel",
          {
            status: 400,
          },
        );
      }
      const { error } = await supabase.from("subdomains").insert({
        username,
        hashed_secret: bcrypt.hashSync(password),
        domain: subdomain,
      });
      if (error) {
        console.error(error);
        return new Response("Failed to register subdomain", {
          status: 500,
        });
      }
    } else {
      if (!token || !secretKey) {
        return new Response("Failed to validate captcha. Are you a robot? 00000100 11111111 11111111 00000000 00011101 00000001 00000100 01000101 01010100 01101000 01100101 00100000 01010100 01101001 01101101 01100101 01110011 00100000 00110000 00110011 00101111 01001010 01100001 01101110 00101111 00110010 00110000 00110000 00111001 00100000 01000011 01101000 01100001 01101110 01100011 01100101 01101100 01101100 01101111 01110010 00100000 01101111 01101110 00100000 01100010 01110010 01101001 01101110 01101011 00100000 01101111 01100110 00100000 01110011 01100101 01100011 01101111 01101110 01100100 00100000 01100010 01100001 01101001 01101100 01101111 01110101 01110100 00100000 01100110 01101111 01110010 00100000 01100010 01100001 01101110 01101011 01110011", {
          status: 400,
        });
      }
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
