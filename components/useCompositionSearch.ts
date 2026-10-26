"use client";

import { useRef, useState, type ChangeEvent, type CompositionEvent, type KeyboardEvent } from "react";

/** Keep the visible draft live; only publish a search query after IME composition finishes. */
export function useCompositionSearch(initial = "") {
  const [value, setValue] = useState(initial);
  const [query, setQuery] = useState(initial);
  const composing = useRef(false);

  function reset(next: string) {
    composing.current = false;
    setValue(next);
    setQuery(next);
  }

  return {
    query,
    reset,
    isComposing: () => composing.current,
    inputProps: {
      value,
      onChange(event: ChangeEvent<HTMLInputElement>) {
        const next = event.currentTarget.value;
        const nativeComposing = (event.nativeEvent as InputEvent).isComposing;
        setValue(next);
        if (nativeComposing) composing.current = true;
        if (!composing.current && !nativeComposing) setQuery(next);
      },
      onCompositionStart() { composing.current = true; },
      onCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
        composing.current = false;
        const next = event.currentTarget.value;
        setValue(next);
        setQuery(next);
      },
      onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        // Safari may report IME confirmation as Enter + keyCode 229 after compositionend.
        if (event.key === "Enter" && (composing.current || event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
      },
    },
  };
}
