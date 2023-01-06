import supabase from "./supabase.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const reservedNames = [
  "aaron",
  "citadel",
  "dtvelectronics",
  "runcitadel",
  "aarondewes",
  "bitcoin",
  "lightning",
];

export async function validateAuth(username: string, password: string) {
  const { data, error } = await supabase
    .from("subdomains")
    .select()
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.error(error);
    return false;
  }
  if (!data) {
    return false;
  }
  return bcrypt.compareSync(password, data.hashed_secret) ? data : false;
}

export async function validateAuthFromRequest(req: Request): Promise<Response | Exclude<Awaited<ReturnType<typeof validateAuth>>, false>> {
  // Get the Authorization header
  const auth = req.headers.get("Authorization");
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Check if the Authorization header is valid
  const authParts = auth.split(" ");
  if (authParts[0] !== "Basic") {
    return new Response("Unauthorized", { status: 401 });
  }
  // Decode the base64 encoded username:password
  const decoded = atob(authParts[1]);
  const [username, password] = decoded.split(":");
  // Check if the username and password are valid
  const authResult = await validateAuth(username, password);
  if (!authResult) {
    return new Response("Unauthorized", { status: 401 });
  } else {
    return authResult;
  }
}