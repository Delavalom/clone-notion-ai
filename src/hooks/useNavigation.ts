import { NavigationContext } from "~/context/NavigationContext";
import { useContext } from "react";

export const useNavigation = () => {
    return useContext(NavigationContext)
}