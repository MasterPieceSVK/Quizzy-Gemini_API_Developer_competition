"use client";

import CreateQuestionCard from "@/components/CreateQuestionCard";
import EditQuestionCard from "@/components/EditQuestionCard";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Question = {
  id?: number;
  exam_id?: number;
  question: string;
  options: string[];
  correct_option?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Exam = {
  id: number;
  user_id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type ExamData = {
  exam: Exam;
  questions: Question[];
};

export type ExamObject = {
  name: string;
  exam: Question[];
};

export type Input = {
  data: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [undefinedError, setUndefinedError] = useState(false);
  const [requestError, setRequestError] = useState("");
  const id = params.id;

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
    if (paramExam && paramExam != "undefined") {
      const parsedExam: ExamData = JSON.parse(paramExam);
      setName(parsedExam.exam.title);
      setQuestions(parsedExam.questions);
    } else {
      setUndefinedError(true);
    }
  }, []);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options.map((opt, oi) =>
              oi === optionIndex ? value : opt
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectChange = (index: number, value: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, correct_option: value } : q
    );
    setQuestions(updatedQuestions);
  };

  function handleExamNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function addQuestion() {
    const newQuestion: Question = {
      question: "New Question",
      options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      correct_option: "Answer 1",
    };
    setQuestions([...questions, newQuestion]);
  }

  function onQuestionDelete(index: number) {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  }

  const updateMutation = useMutation<Response, Error, Input>({
    mutationFn: async (data) => {
      return axios.put(`${process.env.NEXT_PUBLIC_BASEURL}/exams/${id}`, data, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(res);
      router.push("/teacher-dashboard?edit=true");
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
      exam: questions,
    };
    const input = { data: JSON.stringify(examObject) };
    console.log(examObject);
    updateMutation.mutate(input);
  }

  return (
    <div className=" h-lvh">
      <div className="h-[5%] bg-base-100">
        <Link href={`/exam/${id}`}>
          <button className="btn btn-ghost mt-2 ml-2">Back</button>
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

          {questions &&
            questions.map((question, index) => {
              const theOption = question.options.find(
                (option) => option === question.correct_option
              );
              if (!theOption) {
                question.correct_option = question.options[0];
              }
              return (
                <EditQuestionCard
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
            disabled={questions.length >= 20}
          >
            {questions.length < 20 ? (
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Editing..." : "Edit"}
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
            An error occurred when creating your exam. Maybe the document
            wasn&apos;t read correctly. Please try again.
          </h4>
          <Link href={"/exams/create"}>
            <button className="btn btn-primary ">Back</button>
          </Link>
        </div>
      )}
    </div>
  );
}
