import { useCallback, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  document.addEventListener("selectionchange", onChange);
  return () => document.removeEventListener("selectionchange", onChange);
};

function getSnapshot() {
  return document.getSelection();
}

export function useSelection() {
  const selection = useSyncExternalStore(
    useCallback(subscribe, []),
    () => getSnapshot()?.toString(),
    () => undefined
  );

  return selection;
}
