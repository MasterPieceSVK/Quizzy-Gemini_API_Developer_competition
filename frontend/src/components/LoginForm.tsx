import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Error, Response } from "./RegisterForm";

export default function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  const { mutate: loginMutate } = useMutation<Response, Error, SigninSchema>({
    mutationFn: async (data) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/auth/login`, data, {
        withCredentials: true,
      });
    },
    onSuccess: (res: Response) => {
      setFormError(null);
      localStorage.setItem("hasAccount", "true");
      router.push(`/${res.data.role}-dashboard`);
    },
    onError: (e) => {
      console.log(e);
      const errorMessage = e.response?.data?.error || "An error occurred";
      setFormError(errorMessage);
    },
  });

  function isDisabled() {
    if (errors.usernameOrEmail || errors.password) return true;
    return false;
  }

  const signinSchema = z.object({
    usernameOrEmail: z.string(),
    password: z.string(),
  });

  type SigninSchema = z.infer<typeof signinSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (data: SigninSchema) => {
    const result = {
      ...data,
      username: data.usernameOrEmail.includes("@")
        ? undefined
        : data.usernameOrEmail,
      email: data.usernameOrEmail.includes("@")
        ? data.usernameOrEmail
        : undefined,
    };
    setFormError(null);
    loginMutate(result);
  };

  return (
    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username or Email</span>
          </label>
          <input
            type="text"
            placeholder="Username or Email"
            className="input input-bordered"
            {...register("usernameOrEmail")}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
            {...register("password")}
          />
        </div>
      </div>
      <ul className="list-disc ml-8">
        {errors.usernameOrEmail && (
          <li>
            <p className="text-red-500  ">{errors.usernameOrEmail.message}</p>
          </li>
        )}

        {errors.password && (
          <li>
            <p className="text-red-500">{errors.password.message}</p>
          </li>
        )}
      </ul>
      {formError && <p className="text-red-500 mt-4">{formError}</p>}

      <div className="form-control mt-6">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isDisabled()}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
