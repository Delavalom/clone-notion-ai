/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";

export const useDebouncer = <T>(state: T, handler: (arg: T) => void) => {
  const memoizedState = useMemo(() => state, []);
  useEffect(() => {
    const updateTitle = setTimeout(() => {
      handler(state);
    }, 700);

    return () => clearTimeout(updateTitle);
  }, [memoizedState]);
};
