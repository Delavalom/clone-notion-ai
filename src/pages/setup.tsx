import { type FC } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AppLayout } from "@/components/Layouts";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

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
  } = useForm<FormData>({ resolver: zodResolver(formData) });
  const username = trpc.addUsername.useMutation();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const user = await username.mutate({ username: data.username });
    return user;
  };

  return (
    <section className="w-screen h-screen flex items-center justify-center bg-white">
      <form
        className="flex flex-col gap-2 relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10"
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()
          return handleSubmit(onSubmit);
        }}
      >
        <label className="mb-2 block text-sm text-gray-600">Username</label>
        <input
          type="text"
          placeholder="e.g. someusername2002"
          {...register("username", { required: true })}
          className="w-full mb-4 rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-300 shadow shadow-gray-100 focus:border-gray-500 focus:outline-none valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
          autoComplete="off"
          required
          pattern="[0-9a-zA-Z]{2,}"
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}
        <button
          type="submit"
          className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-white focus:text-black focus:border-2 focus:border-black focus:outline-none group-invalid:pointer-events-none group-invalid:opacity-70"
        >
          Set up
        </button>
      </form>
    </section>
  );
};

export default Setup;
