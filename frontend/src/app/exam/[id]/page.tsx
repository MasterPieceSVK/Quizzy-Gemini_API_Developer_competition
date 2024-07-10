"use client";
import { Question } from "@/app/exams/finalize/page";
import QuestionCard from "@/components/QuestionCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ExamResponse = {
  exam: {
    id: string;
    title: string;
  };
  questions: Question[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [requestError, setRequestError] = useState("");
  const [exam, setExam] = useState<ExamResponse>();

  const router = useRouter();

  const { isPending } = useQuery({
    queryKey: ["exam"],
    queryFn: () => {
      if (params.id) {
        axios
          .get<ExamResponse>(
            `${process.env.NEXT_PUBLIC_BASEURL}/exams/${params.id}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setExam(res.data);
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
          });
      }
    },
  });

  function handleExamEdit() {
    router.push(`/exam/edit/${params.id}?exam=${JSON.stringify(exam)}`);
  }
  function handleAssign() {
    console.log("assign");
  }

  return (
    <div className="bg-base-100">
      <nav className="flex justify-between">
        <Link href={"/teacher-dashboard"}>
          <button className="btn btn-ghost mt-2 ml-2">Quizzy</button>
        </Link>
        <button onClick={handleExamEdit} className="btn btn-ghost mt-2 mr-2">
          Edit
        </button>
      </nav>
      <main>
        {isPending && <p>Loading...</p>}
        {requestError && (
          <p className="text-wrap text-center text-red-500 mt-4">
            {requestError}
          </p>
        )}
        {exam && (
          <div className=" gap-4 flex flex-col items-center">
            <h1 className="text-xl text-center">{exam.exam.title}</h1>
            <Link
              href={`/exam/assign/${exam.exam.id}`}
              className="w-full md:w-5/6 2xl:w-3/5"
            >
              <button
                className="btn bg-green-500 text-xl text-white w-full "
                onClick={handleAssign}
              >
                Assign Quiz
              </button>
            </Link>
            <div className="flex flex-col gap-3 items-center w-full">
              {exam.questions.map((question, i) => (
                <QuestionCard {...question} key={i} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
