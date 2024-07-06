"use client";

import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

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
    onSuccess: () => {
      setIsAuth(true);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  useEffect(() => {
    authMutate();
  }, []);

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="mb-4 text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 via-primary to-blue-600">
            Quizzy:
          </h1>
          <h1 className="text-4xl font-bold">
            The Ultimate Tool for Modern Educators
          </h1>
          <p className="py-6">
            Upload your teaching materials and let Quizzy generate comprehensive
            multiple-choice exams in minutes.
          </p>
          <Link href={`${isAuth ? "/dashboard" : "/register"}`}>
            <button className="btn btn-primary">Get Started with Quizzy</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
