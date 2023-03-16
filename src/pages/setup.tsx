import { type FC } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AppLayout } from "@/components/Layouts";
import { trpc } from "@/lib/trpc";

type Props = {};

const formData = z.object({
  username: z.string().min(2).max(30),
});

type FormData = z.infer<typeof formData>;

const Setup: FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    trpc.
    return 
  }

  return (
    <AppLayout>
      <form>
        <label htmlFor="" />
        <input type="text" name="" id="" />
        setup
      </form>
    </AppLayout>
  );
};

export default Setup;
