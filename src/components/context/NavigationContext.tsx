import { ReactNode, createContext, useState } from "react";

const initialState = {
    isOpen: false,
    setIsOpen: (isOpen: boolean) => {}
}

export const NavigationContext = createContext(initialState)

export const NavigationProvider = ({children}: {children: ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <NavigationContext.Provider value={{isOpen, setIsOpen}}>
            {children}
        </NavigationContext.Provider>
    )
}