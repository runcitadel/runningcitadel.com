import { useEffect, useState } from "preact/hooks";
import { Component } from "preact";
import { CountUp as _CountUp } from "../utils/countup.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface CounterProps {
  // (default)
  startVal?: number; // number to start at (0)
  endVal: number;
  decimalPlaces?: number; // number of decimal places (0)
  duration?: number; // animation duration in seconds (2)
  useGrouping?: boolean; // example: 1,000 vs 1000 (true)
  useIndianSeparators?: boolean; // example: 1,00,000 vs 100,000 (false)
  useEasing?: boolean; // ease animation (true)
  smartEasingThreshold?: number; // smooth easing for large numbers above this if useEasing (999)
  smartEasingAmount?: number; // amount to be eased for numbers above threshold (333)
  separator?: string; // grouping separator (,)
  decimal?: string; // decimal (.)
  prefix?: string; // text prepended to result
  suffix?: string; // text appended to result
  numerals?: string[]; // numeral glyph substitution
}

export default function CountUp(props: CounterProps) {
  const [count, setCount] = useState((props.prefix || "") + (props.startVal || 0).toString() + (props.suffix || ""));

  useEffect(() => {
    const countup = new _CountUp(setCount, props.endVal, props);
    countup.start();
    return () => {
      countup.pauseResume();
    };
  }, [props.endVal]);

  return <span>{count}</span>;
}