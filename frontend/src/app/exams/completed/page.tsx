"use client";

import { Quiz, QuizResponse } from "@/app/student-dashboard/page";
import { Error, Response } from "@/components/RegisterForm";
import StudentQuizCard from "@/components/StudentQuizCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [requestError, setRequestError] = useState("");
  const [noQuizzes, setNoQuizzes] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>();
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

  const { isPending } = useQuery({
    queryKey: ["student-quizzes"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/exams/student-completed`, {
          withCredentials: true,
        })
        .then((res: QuizResponse) => {
          console.log(res);
          if (res.status === 204) {
            setNoQuizzes(true);
            return;
          } else {
            setQuizzes(res.data);
          }
        })
        .catch((e: Error) => {
          console.log(e);
          if (e.response?.data) {
            setRequestError(e.response.data.error);
          } else if (e.code === "ERR_NETWORK") {
            setRequestError("Network error. The server may be down.");
          } else if (e.message) {
            setRequestError(e.message);
          }
        }),
  });

  return (
    <div className="bg-base-100">
      <nav>
        <Link href={"/student-dashboard"}>
          <button className="btn btn-ghost mt-2 ml-2">Back</button>
        </Link>
      </nav>
      <main className="flex flex-col items-center gap-4">
        <h2 className="text-2xl">Your completed exams</h2>
        <div className="w-full">
          {requestError && (
            <p className="text-center text-wrap text-red-500">{requestError}</p>
          )}
          {noQuizzes && (
            <p className="text-center text-xl text-wrap">
              You don&apos;t have any quizzes assigned
            </p>
          )}
          {isPending && (
            <p className="text-center text-xl text-wrap">Fetching quizzes...</p>
          )}
          <div className="flex flex-col gap-1 items-center">
            {quizzes &&
              quizzes.map((quiz, i) => {
                return <StudentQuizCard {...quiz} key={i} />;
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
