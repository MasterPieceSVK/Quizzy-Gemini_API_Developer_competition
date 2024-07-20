"use client";

import CreateQuestionCard from "@/components/CreateQuestionCard";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export type Question = {
  correct?: string;
  correct_option?: string;

  question: string;
  options: string[];
  id?: number;
};

type ExamObject = {
  name: string;
  exam: Question[];
};

type Input = {
  data: string;
};

function PageContent() {
  const [exam, setExam] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [undefinedError, setUndefinedError] = useState(false);
  const [requestError, setRequestError] = useState("");

  const searchParams = useSearchParams();
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

    const paramExam = searchParams.get("exam");
    const paramName = searchParams.get("name");
    if (
      paramExam &&
      paramName &&
      paramExam != "undefined" &&
      paramName != "undefined"
    ) {
      setExam(JSON.parse(paramExam));
      setName(paramName);
    } else {
      setUndefinedError(true);
    }
  }, []);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExam = exam.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setExam(updatedExam);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedExam = exam.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options.map((opt, oi) =>
              oi === optionIndex ? value : opt
            ),
          }
        : q
    );
    setExam(updatedExam);
  };

  const handleCorrectChange = (index: number, value: string) => {
    const updatedExam = exam.map((q, i) =>
      i === index ? { ...q, correct: value } : q
    );
    setExam(updatedExam);
  };

  function handleExamNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function addQuestion() {
    const newQuestion = {
      question: "New Question",
      options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      correct: "Answer 1",
    };
    setExam([...exam, newQuestion]);
  }

  function onQuestionDelete(index: number) {
    const updatedExam = exam.filter((_, i) => i !== index);
    setExam(updatedExam);
  }

  const finalizeMutation = useMutation<Response, Error, Input>({
    mutationFn: async (data) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/exams/finalize`,
        data,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      router.push("/teacher-dashboard?success=true");
    },
    onError: (e: Error) => {
      console.log(e);
      if (e.response?.data) {
        setRequestError(e.response.data.error);
      } else if (e.code === "ERR_NETWORK") {
        setRequestError("Network error. The server may be down.");
      } else if (e.message) {
        setRequestError(e.message);
      }
    },
  });

  function onCreateExam() {
    const examObject: ExamObject = {
      name,
      exam,
    };
    const input = { data: JSON.stringify(examObject) };
    finalizeMutation.mutate(input);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className=" h-lvh">
        <div className="h-[5%] bg-base-100">
          <Link href={"/teacher-dashboard"}>
            <button className="btn btn-ghost mt-2 ml-2">Quizzy</button>
          </Link>
        </div>
        {!undefinedError ? (
          <main className="bg-base-100 flex flex-col  items-center justify-center w-full min-h-[95%] gap-5">
            <input
              type="text"
              placeholder="Type here"
              className="input input-ghost w-full max-w-xs text-center text-xl"
              defaultValue={name}
              onChange={handleExamNameChange}
            />

            {exam &&
              exam.map((question, index) => {
                const theOption = question.options.find(
                  (option) => option === question.correct
                );
                console.log(theOption);
                if (!theOption) {
                  question.correct = question.options[0];
                }
                return (
                  <CreateQuestionCard
                    key={index}
                    question={question}
                    index={index}
                    onQuestionChange={handleQuestionChange}
                    onOptionChange={handleOptionChange}
                    onCorrectChange={handleCorrectChange}
                    onQuestionDelete={onQuestionDelete}
                  />
                );
              })}
            <button
              className="btn w-5/6 xl:w-1/2 btn-primary disabled:border-red-500 disabled:border-2"
              onClick={addQuestion}
              disabled={exam.length >= 20}
            >
              {exam.length < 20 ? (
                <PlusIcon size={15} />
              ) : (
                <h5 className="text-white">Max. number of questions reached</h5>
              )}
            </button>

            <button
              className={`btn btn-primary ${
                !requestError && "mb-7"
              } disabled:border-primary disabled:text-primary`}
              onClick={onCreateExam}
              disabled={finalizeMutation.isPending}
            >
              {finalizeMutation.isPending ? "Creating..." : "Create"}
            </button>
            {requestError && (
              <h6 className="text-red-500 text-center text-wrap w-5/6 mb-7">
                {requestError}
              </h6>
            )}
          </main>
        ) : (
          <div className="flex flex-col items-center justify-center gap-5 bg-base-100 h-full">
            <h4 className="text-center text-wrap px-3">
              An error occured when creating your quiz. Maybe the document
              wasn&apos;t read correctly. Please try again.
            </h4>
            <Link href={"/exams/create"}>
              <button className="btn btn-primary ">Back</button>
            </Link>
          </div>
        )}
      </div>
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
