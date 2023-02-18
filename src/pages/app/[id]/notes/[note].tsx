import { AppLayout } from "@/components/Layouts";
import { useRouter } from "next/router";
import { type FC } from "react";

type Props = {};

const Note: FC<Props> = ({}) => {
  const { note } = useRouter().query;

  return (
    <AppLayout>
      <section className="bg-white w-screen h-screen">{note}</section>
    </AppLayout>
  );
};

export default Note;
