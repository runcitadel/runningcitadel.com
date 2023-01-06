import { useEffect, useState } from "preact/hooks";

export default function SubDomainInput() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(subdomain);
    if (subdomain !== null && subdomain.length < 5) {
      setError("Your subdomain should be at least 5 letters long.");
      return;
    }
    setError("");
  }, [subdomain]);

  return (
    <div>
      <div class="text-xl">
        <input
          value={subdomain as string}
          name="subdomain"
          type="text"
          placeholder="yourname"
          class="border-0 bg-transparent border-b-2 p-2 border-black dark:border-white text-lg text-center"
          onInput={(ev) => setSubdomain((ev.target! as unknown as HTMLInputElement).value)}
        />.runningcitadel.com
      </div>
        {error && <span class="block text-center text-red-300 dark:text-red-700">{error}</span>}
    </div>
  );
}
