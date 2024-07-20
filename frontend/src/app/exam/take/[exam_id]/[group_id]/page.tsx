"use client";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Quiz = {
  examName: string;
  questions: Question[];
  group_id: string;
};

type Question = {
  id: number;
  exam_id: number;
  question: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
};

type QuizResponse = {
  data: {
    examName: string;
    questions: Question[];
    group_id: string;
  };
};

type ExamObject = {
  exam_id: number;
  answers: { id: number; answer: string }[];
  group_id: string;
};

type SubmitResponse = {
  data: number;
};

export default function Page({
  params,
}: {
  params: { exam_id: string; group_id: string };
}) {
  const [requestError, setRequestError] = useState("");
  const [quiz, setQuiz] = useState<Quiz>();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ id: number; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [successPercentage, setSuccessPercentage] = useState(-1);
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
    queryKey: ["take-quiz"],
    queryFn: () =>
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASEURL}/exams/take/${params.exam_id}/${params.group_id}`,
          {
            withCredentials: true,
          }
        )
        .then((res: QuizResponse) => {
          setQuiz(res.data);
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

  function handleNextQuestion() {
    if (quiz) {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { id: quiz.questions[questionIndex].id, answer: currentAnswer },
      ]);

      setCurrentAnswer("");

      const radioButtons = document.getElementsByName("radio-3");
      radioButtons.forEach((radio) => {
        (radio as HTMLInputElement).checked = false;
      });
      setQuestionIndex(questionIndex + 1);
    }
  }

  const submitExamMutation = useMutation<SubmitResponse, Error, ExamObject>({
    mutationFn: async (answers) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/exams/submit`,
        answers,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      setSuccessPercentage(res.data);
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

  function handleExamSubmit() {
    if (quiz) {
      const answersArray = answers;

      answersArray.push({
        id: quiz.questions[questionIndex].id,
        answer: currentAnswer,
      });
      const answerObject: ExamObject = {
        exam_id: quiz.questions[0].exam_id,
        answers: answersArray,
        group_id: quiz.group_id,
      };

      submitExamMutation.mutate(answerObject);
    }
  }

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  return (
    <div className="bg-base-100 mt-5">
      <main>
        {isPending && <p className="text-white text-center">Loading quiz...</p>}

        {successPercentage === -1 && quiz && (
          <div className="text-center grid gap-3 px-2">
            <h1 className="text-center text-primary text-xl font-semibold">
              {quiz.examName}
            </h1>
            {quiz.questions[questionIndex] ? (
              <div className="flex justify-center flex-col items-center gap-5">
                <p className="text-2xl font-semibold">
                  {quiz.questions[questionIndex].question}
                </p>

                <div className="grid gap-2 px-2">
                  {quiz.questions[questionIndex].options.map(
                    (option, index) => {
                      return (
                        <div
                          key={index}
                          className=" flex gap-3 text-lg items-center"
                        >
                          <input
                            id={String(index)}
                            type="radio"
                            name="radio-3"
                            className=" radio radio-primary"
                            value={currentAnswer}
                            onChange={() => setCurrentAnswer(option)}
                          />
                          <label
                            htmlFor={String(index)}
                            className="text-start text-xl text-wrap"
                          >
                            {option}
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <h5>End of the exam</h5>
            )}

            <div className="flex justify-center">
              {quiz.questions[questionIndex + 1] ? (
                <button
                  className="btn btn-primary mt-5 w-full md:w-1/2 xl:w-1/4 mb-0 disabled:border-primary disabled:border-2 disabled:text-primary"
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn btn-primary mt-5 w-full md:w-1/2 xl:w-1/4 disabled:border-primary disabled:border-2 disabled:text-primary"
                  onClick={handleExamSubmit}
                  disabled={!currentAnswer}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
        {successPercentage !== -1 && (
          <div className="px-2 flex flex-col justify-center items-center h-svh gap-2">
            <h4 className="text-center text-wrap text-2xl">
              Your score is
              <br />
              <span className="text-8xl ">{successPercentage}%</span>
            </h4>
            <Link
              href={"/student-dashboard"}
              className=" grid place-items-center w-full"
            >
              <button className="btn btn-primary w-full md:w-1/2 xl:w-1/4">
                Back to dashboard
              </button>
            </Link>
          </div>
        )}
      </main>
      {requestError && (
        <p className="text-center text-wrap text-red-500">{requestError}</p>
      )}
    </div>
  );
}
