import { Head } from "$fresh/runtime.ts";

import CfTurnstile from "$turnstile/components/CfTurnstile.tsx";
import SubDomainInput from "../islands/SubDomainInput.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sign up for your subdomain</title>
      </Head>
      <div class="dark:bg-gray-800 dark:text-white min-h-screen">
        <div class="min-h-screen flex items-center justify-center flex-col">
          <form
            method="POST"
            action="/success"
            class="flex items-center justify-center flex-col"
          >
            <SubDomainInput />
            <div class="text-xl mt-2 mb-1">
              Your login ID:<input
                name="username"
                type="text"
                placeholder="e5deb41a18ea693afce842fb855465b1c4612e504b0440ac031af2df68f29045"
                class="border-0 bg-transparent border-b-2 p-2 border-black dark:border-white text-lg text-center lg:w-[45rem]"
              />
            </div>
            <div class="text-xl my-1">
              Your login secret:{" "}
              <input
                name="password"
                type="text"
                placeholder="b4056df6691f8dc72e56302ddad345d65fead3ead9299609a826e2344eb63aa4"
                class="border-0 bg-transparent border-b-2 p-2 border-black dark:border-white text-lg text-center lg:w-[45rem]"
              />
            </div>
            <CfTurnstile sitekey={Deno.env.get("TURNSTILE_SITE_KEY")!} />
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
            >
              Finish
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
