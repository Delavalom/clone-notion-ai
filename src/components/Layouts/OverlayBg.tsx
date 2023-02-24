import { useContext, type FC } from "react";
import { NavigationContext } from "../../context/NavigationContext";

type Props = {};

export const OverlayBg: FC<Props> = () => {
  const { isOpen, setIsOpen } = useContext(NavigationContext);

  return (
    <div
      className={`fixed inset-0 z-20 bg-black bg-opacity-10 transition duration-200 ease-in-out dark:bg-opacity-50 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={() => setIsOpen(false)}
    />
  );
};
