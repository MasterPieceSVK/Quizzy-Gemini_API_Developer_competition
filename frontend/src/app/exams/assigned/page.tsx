"use client";
import AssignedExam from "@/components/AssignedExam";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type ExamResult = {
  id: number;
  user_id: number;
  exam_id: number;
  group_id: number;
  score: number;
  finished: boolean;
  createdAt: string;
  updatedAt: string;
  group_name: string;
  exam_name: string;
  username: string;
  email: string;
};

export type Group = ExamResult[];

export type Exam = Group[];

type Exams = Exam[];

export default function Page() {
  const [requestError, setRequestError] = useState("");
  const [exams, setExams] = useState<Exams>([]);
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

  const { isPending } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/exams/assigned`, {
          withCredentials: true,
        })
        .then((res) => {
          setExams(res.data.reverse());
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
        <Link href={"/teacher-dashboard"}>
          <button className="btn btn-ghost">Back</button>
        </Link>
      </nav>
      <main className=" flex justify-center">
        <div className="flex flex-col gap-3 px-2 w-full md:w-5/6 xl:w-1/2">
          <h1 className="text-center text-2xl">Assigned quizzes</h1>
          {requestError && (
            <p className="text-red-500 text-center text-wrap">{requestError}</p>
          )}
          {isPending && (
            <p className="text-center text-wrap">Fetching assigned exams...</p>
          )}
          {exams.length === 0 && !isPending && (
            <p className="text-center">You didn&apos;t assign any exams yet</p>
          )}
          {exams &&
            exams.map((exam, i) => {
              return <AssignedExam key={i} exam={exam} />;
            })}
        </div>
      </main>
    </div>
  );
}
