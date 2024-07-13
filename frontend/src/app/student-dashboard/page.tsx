"use client";

import { Error, Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  const { mutate: authMutate } = useMutation<Response, Error>({
    mutationFn: async () => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/me`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res: Response) => {
      if (res.data.role === "teacher") {
        router.push("/teacher-dashboard");
      }
    },
    onError: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    authMutate();
  }, []);

  return (
    <div className="bg-base-100">
      <nav className="flex flex-col md:flex-row justify-between mt-2">
        <Link href={"/"}>
          <button className="btn btn-ghost ml-2">Quizzy</button>
        </Link>
        <div className="flex flex-col md:flex-row gap-4 md:gap-7 items-center mr-2">
          <h5 className="block md:hidden text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 via-primary to-blue-600 p-2">
            Quizzy
          </h5>
          <Link href={"/student-groups"}>
            <button className="btn btn-ghost text-lg border-primary border-2">
              My groups
            </button>
          </Link>
          <Link href={"/exams/completed"}>
            <button className="btn btn-ghost text-lg border-primary border-2">
              Completed Quizzes
            </button>
          </Link>
        </div>
      </nav>
      <main className="flex flex-col items-center gap-8 ">
        <div className="flex items-center">
          <h5 className="hidden md:block text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 via-primary to-blue-600 p-2">
            Quizzy
          </h5>
        </div>

        <div></div>
      </main>
    </div>
  );
}
