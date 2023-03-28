import { NavigationContext } from "~/context/NavigationContext";
import { useContext } from "react";

export const useNavigation = () => {
    const navigation = useContext(NavigationContext)

    if(!navigation?.setIsOpen) throw new Error("setIsOpen is undefined")

    return {
        isOpen: navigation?.isOpen,
        setIsOpen: navigation.setIsOpen
    }
}