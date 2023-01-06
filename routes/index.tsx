import { Head } from "$fresh/runtime.ts";
import CountUp from "../islands/CountUp.tsx";
import supabase from "../utils/supabase.ts";

import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<HomeData> = {
  async GET(req, ctx) {
    const { count, error } = await supabase.rpc(
      "unique_backup_uploads_today",
      undefined,
      { count: "exact", head: true },
    );

    if (error) {
      console.error(error);
      return ctx.renderNotFound();
    }

    return ctx.render({
      userCount: count!,
    });
  },
};

interface HomeData {
  userCount: number;
}

export default function Home({ data }: PageProps<HomeData>) {
  return (
    <>
      <Head>
        <title>running Citadel</title>
      </Head>
      <div class="dark:bg-gray-800 dark:text-white min-h-screen">
        <div class="min-h-screen flex items-center justify-center flex-col">
          <h1 class="text-7xl font-semibold tracking-tight leading-none md:text-8xl xl:text-9xl mb-4">
            <CountUp endVal={data.userCount} suffix={" nodes"} />
          </h1>
          <p>
            are already running Citadel -{" "}
            <a
              href="https://runcitadel.space"
              class="text-blue-700 dark:text-blue-300"
            >
              Set up yours now!
            </a>
          </p>
        </div>
        <div class="flex items-center justify-center flex-col pb-4">
          <h2 class="font-bold text-5xl mb-2 mt-8">Meet some of our users</h2>
          <h4 class="text-2xl mb-6">
            These sites have Bitcoin functionality (like payments) using
            Citadel.
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="https://dtvelectronics.com">
              <img
                src="https://dtvelectronics.com/wp-content/uploads/2022/10/dtv-logo-white-optimized.png"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
