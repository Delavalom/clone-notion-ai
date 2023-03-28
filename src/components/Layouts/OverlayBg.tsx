import { type FC } from "react";
import { useNavigation } from "~/hooks/useNavigation";

export const OverlayBg: FC = () => {
  const { isOpen, setIsOpen } = useNavigation();

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
