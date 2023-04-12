import { useCallback, useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
  handler?: (arg: T) => void
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const handlerCallback = useCallback(() => {
    if (handler) {
        return handler(value)
    }
  }, [value, handler])

  useEffect(() => {
    const id = setTimeout(() => {
        handlerCallback();
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay, handlerCallback]);

  return debouncedValue;
}
