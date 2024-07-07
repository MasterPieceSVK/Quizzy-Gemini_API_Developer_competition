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
      if (res.data.role === "student") {
        router.push("/student-dashboard");
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
    <main className="bg-base-100 flex flex-col  items-center w-full h-lvh gap-5">
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0 md:justify-around w-full items-center h-1/4">
        <h3 className="text-3xl">Your Exams</h3>
        <Link href={"/exams/create"}>
          <button className="btn btn-primary">Create New Exam</button>
        </Link>
      </div>
      <h4>Exams</h4>
    </main>
  );
}
