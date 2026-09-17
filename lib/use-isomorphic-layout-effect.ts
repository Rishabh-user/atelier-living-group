import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect is a no-op on the server and React warns about it there.
 * Use this wherever an effect must run before the first paint on the client.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
