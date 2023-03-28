import { useCallback } from "react";
import { RenderElement, RenderLeaf } from "~/components/Editor/Renders";

export const useRenders = () => {
    const renderElement = useCallback(RenderElement, []);
    const renderLeaf = useCallback(RenderLeaf, []);
    return  {
        renderElement,
        renderLeaf
    }
}