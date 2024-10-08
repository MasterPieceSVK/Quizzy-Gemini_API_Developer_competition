"use client";

import ExamCard from "@/components/ExamCard";
import { SheetIcon } from "@/components/icons/SheetIcon";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface ExamsResponse {
  data: Exam[];
}

export interface Exam {
  id: number;
  title: string;
  questionCount: number;
}

function PageContent() {
  const [createdExam, setCreatedExam] = useState(false);
  const [editedExam, setEditedExam] = useState(false);

  const [exams, setExams] = useState<Exam[]>([]);
  const [requestError, setRequestError] = useState("");
  const [noExams, setNoExams] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const editted = searchParams.get("edit");
    if (success) {
      setCreatedExam(true);
      setTimeout(() => {
        setCreatedExam(false);
      }, 5000);
    }
    if (editted) {
      setEditedExam(true);
      setTimeout(() => {
        setEditedExam(false);
      }, 5000);
    }
  }, []);

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

  const { isPending } = useQuery({
    queryKey: ["exams"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/exams`, {
          withCredentials: true,
        })
        .then((res: ExamsResponse) => {
          setExams(res.data);
        })
        .catch((e: Error) => {
          console.log(e);
          if (e.response?.data?.error === "No quizzes found for this user") {
            setNoExams(true);
          } else if (e.response?.data) {
            setRequestError(e.response.data.error);
          } else if (e.code === "ERR_NETWORK") {
            setRequestError("Network error. The server may be down.");
          } else if (e.message) {
            setRequestError(e.message);
          }
        }),
  });

  useEffect(() => {
    authMutate();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="bg-base-100 flex flex-col  items-center w-full h-lvh">
        {createdExam && (
          <div className="bg-primary w-full p-3">
            <h4 className="text-black text-center text-wrap font-bold">
              You successfully created a new quiz
            </h4>
          </div>
        )}
        {editedExam && (
          <div className="bg-primary w-full p-3">
            <h4 className="text-black text-center text-wrap font-bold">
              You successfully edited a quiz
            </h4>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0 md:justify-around w-full items-center mt-5">
          <h3 className="text-3xl">Your Quizzes</h3>
          <div className="flex flex-col md:flex-row gap-4 md:gap-7 items-center">
            <a href={"/teacher-groups"} className="link link-hover">
              My groups
            </a>
            <a href={"/exams/assigned"} className="link link-hover ">
              Assigned Quizzes
            </a>
            <Link href={"/exams/create"}>
              <button className="btn btn-primary">Create New Quiz</button>
            </Link>
            <Link href={"/logout"}>
              <button className="btn btn-ghost mr-2 ">Logout</button>
            </Link>
          </div>
        </div>
        {isPending && <h4 className="text-white mt-5">Fetching Quizzes...</h4>}
        {requestError && (
          <h4 className=" mt-6 text-red-500 text-center text-wrap">
            {requestError}
          </h4>
        )}
        {noExams && (
          <div className="flex flex-col gap-8 items-center justify-center h-full">
            <h4 className="mt-6 text-2xl">You don&apos;t have any quizzes</h4>
            <SheetIcon size={200} />
          </div>
        )}
        <div className="w-full md:w-1/2 flex flex-col mt-16">
          {exams &&
            exams.map((exam, i) => {
              return <ExamCard {...exam} key={i} />;
            })}
        </div>
      </main>
    </Suspense>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
