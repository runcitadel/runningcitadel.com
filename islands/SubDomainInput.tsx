import { useEffect, useState } from "preact/hooks";
import { reservedNames } from "/utils/domain.ts";

export default function SubDomainInput() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [error, setError] = useState("");

  // @ts-expect-error useEffect normally shouldn't be async
  useEffect(async () => {
    if (subdomain !== null && subdomain.length < 5) {
      setError("Your subdomain should be at least 5 letters long.");
      return;
    }
    if (reservedNames.includes(subdomain!)) {
      setError("This subdomain is reserved by the Citadel team - contact us if you think this is a mistake.");
      return;
    }
    const res = await fetch(`/api/dns/check/${subdomain}`);
    if (res.status === 200) {
      const { available } = await res.json();
      if (available) {
        setError("");
      } else {
        setError("This subdomain is already taken.");
      }
    } else {
      setError("Failed to check subdomain availability.");
    }
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
