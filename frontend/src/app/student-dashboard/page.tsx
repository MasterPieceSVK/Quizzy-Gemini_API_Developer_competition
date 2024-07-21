"use client";

import { Error, Response } from "@/components/RegisterForm";
import StudentQuizCard from "@/components/StudentQuizCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Quiz = {
  id: number;
  title: string;
  exam_id: number;
  group_id: number;
  score: number;
  finished: boolean;
  groupName: string;
  teacherUsername: string;
};

export type QuizResponse = {
  data: Quiz[];
  status: number;
};

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
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/exams/student-assigned`, {
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
      <nav className="flex flex-col md:flex-row justify-between mt-2">
        <div className="flex justify-between">
          <Link href={"/"}>
            <button className="btn btn-ghost ml-2">Quizzy</button>
          </Link>
          <Link href={"/logout"}>
            <button className="btn btn-ghost mr-2 md:hidden">Logout</button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-7 items-center mr-2">
          <h5 className="block md:hidden text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-primary via-blue-500 to-primary p-2">
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
          <Link href={"/logout"} className="hidden md:block">
            <button className="btn btn-ghost mr-2 ">Logout</button>
          </Link>
        </div>
      </nav>
      <main className="flex flex-col items-center gap-8 ">
        <div className="flex items-center bg-base-200 rounded-xl p-2">
          <h5 className="hidden md:block text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-primary via-blue-500 to-primary p-2">
            Quizzy
          </h5>
        </div>

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
