import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type Response = {
  message: string;
};

export type Error = {
  response?: {
    data?: {
      error: string;
    };
  };
  message: string;
  code?: string;
};

export default function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const signupSchema = z
    .object({
      username: z
        .string()
        .min(5, { message: "Username must be at least 5 characters long." })
        .regex(/^[a-zA-Z0-9]+$/, {
          message: "Username can only contain letters and numbers.",
        }),
      email: z.string().email({
        message: "Valid email is required.",
      }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." }),
      confirmPassword: z.string(),
      role: z.enum(["student", "teacher"], {
        message: "Role must be either 'student' or 'teacher'",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    });

  type SignupSchema = z.infer<typeof signupSchema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate: registerMutate } = useMutation<Response, Error, SignupSchema>(
    {
      mutationFn: async (data) => {
        return axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/register`,
          data,
          { withCredentials: true }
        );
      },
      onSuccess: () => {
        setFormError(null);
        router.push("/dashboard");
      },
      onError: (e) => {
        console.log(e);
        const errorMessage = e.response?.data?.error || "An error occurred";
        setFormError(errorMessage);
      },
    }
  );

  const onSubmit = (data: SignupSchema) => {
    registerMutate(data);
  };

  function isDisabled() {
    if (
      errors.username ||
      errors.email ||
      errors.password ||
      errors.role ||
      errors.confirmPassword
    )
      return true;
    return false;
  }

  return (
    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered"
            {...register("username")}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            {...register("email")}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="input input-bordered"
            {...register("confirmPassword")}
          />
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <select className="input input-bordered" {...register("role")}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <ul className="list-disc ml-8">
        {errors.username && (
          <li>
            <p className="text-red-500  ">{errors.username.message}</p>
          </li>
        )}
        {errors.email && (
          <li>
            <p className="text-red-500">{errors.email.message}</p>
          </li>
        )}
        {errors.password && (
          <li>
            <p className="text-red-500">{errors.password.message}</p>
          </li>
        )}
        {errors.confirmPassword && (
          <li>
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          </li>
        )}
        {errors.role && (
          <li>
            <p className="text-red-500">{errors.role.message}</p>
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
          Signup
        </button>
      </div>
    </form>
  );
}
