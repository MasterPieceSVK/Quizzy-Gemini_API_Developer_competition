"use client";

import ExamCard from "@/components/ExamCard";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ExamsResponse {
  data: Exam[];
}

export interface Exam {
  id: number;
  title: string;
  questionCount: number;
}

export default function Page() {
  const [createdExam, setCreatedExam] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [requestError, setRequestError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      setCreatedExam(true);
      setTimeout(() => {
        setCreatedExam(false);
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
        .catch((e) => {
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

  useEffect(() => {
    authMutate();
  }, []);

  return (
    <main className="bg-base-100 flex flex-col  items-center w-full h-lvh">
      {createdExam && (
        <div className="bg-primary w-full p-3">
          <h4 className="text-black text-center text-wrap font-bold">
            You successfully created a new exam
          </h4>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-0 md:justify-around w-full items-center mt-5">
        <h3 className="text-3xl">Your Exams</h3>
        <Link href={"/exams/create"}>
          <button className="btn btn-primary">Create New Exam</button>
        </Link>
      </div>
      {isPending && <h4 className="text-white mt-5">Fetching Exams...</h4>}
      {requestError && (
        <h4 className="text-red-500 text-center text-wrap">{requestError}</h4>
      )}
      <div className="w-full flex flex-col mt-5">
        {exams &&
          exams.map((exam, i) => {
            return <ExamCard {...exam} key={i} />;
          })}
      </div>
    </main>
  );
}
