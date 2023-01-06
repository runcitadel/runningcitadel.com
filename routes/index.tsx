import { Head } from "$fresh/runtime.ts";
import CountUp from "../islands/CountUp.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>running Citadel</title>
      </Head>
      <div class="dark:bg-gray-800 dark:text-white min-h-screen flex items-center justify-center flex-col">
        <h1 class="text-7xl font-semibold tracking-tight leading-none md:text-8xl xl:text-9xl mb-4">
         <CountUp endVal={300} suffix={" nodes"} />
        </h1>
        <p>are already running Citadel - <a href="https://runcitadel.space">Set up yours now</a>.</p>
      </div>
    </>
  );
}
