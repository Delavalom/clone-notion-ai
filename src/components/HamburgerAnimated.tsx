import { NavigationContext } from "@/context/NavigationContext";
import React, { useContext } from "react";

export default function HamburgerAnimated() {
  const { isOpen, setIsOpen } = useContext(NavigationContext);

  return (

      <div className="relative py-3 sm:max-w-xl">
        <nav>
          <button
            className="relative w-10 h-10 text-gray-500 bg-white rounded-sm focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">isOpen main menu</span>
            <div className="absolute block w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <span
                aria-hidden="true"
                className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${
                  isOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute  h-0.5 w-5 bg-current   transform transition duration-500 ease-in-out ${
                  isOpen && "opacity-0"
                }`}
              ></span>
              <span
                aria-hidden="true"
                className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${
                  isOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              ></span>
            </div>
          </button>
        </nav>
      </div>

  );
}
