import { useCallback, useSyncExternalStore } from "react";

function suscribe(onChange: () => void) {
  document.addEventListener("selectionchange", onChange);
  return () => document.removeEventListener("selectionchange", onChange);
}

function getSnapshot() {
  const selectionObject = document.getSelection()

  if(!selectionObject) return ""

  return selectionObject.toString()
}
export function useSelection() {
  const selection = useSyncExternalStore(useCallback(suscribe, []), getSnapshot, () => "");

  return selection;
}
