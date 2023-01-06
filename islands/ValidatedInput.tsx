import { useEffect, useState } from "preact/hooks";
import { reservedNames } from "/utils/domain.ts";

export default function ValidatedInput(props: { name: string; placeholder: string; }) {
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (value === null) return;
    setError(!value.match(/^([a-f0-9]){64}$/));
  }, [value]);

  return (
    <input
          value={value as string}
          name={props.name}
          type="text"
          placeholder={props.placeholder}
          class={`border-0 bg-transparent border-b-2 p-2 border-black dark:border-white text-lg text-center text-center lg:w-[45rem] ${error ? "border-red-400 dark:border-red-900" : ""}`}
          onInput={(ev) => setValue((ev.target! as unknown as HTMLInputElement).value)}
        />
  );
}
