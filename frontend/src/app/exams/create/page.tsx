"use client";

import { Error as ErrorType, Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ExamCreation = {
  about: string;
  file: File | undefined;
  aditional: string | undefined;
  questionNum: string;
};

type ExamQuestion = {
  question: string;
  options: string[];
  correct: string;
};

type ExamResponse = {
  data: {
    examName: string;
    exam: ExamQuestion[];
  };
};

export default function Page() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [about, setAbout] = useState("");
  const [aditional, setAditional] = useState("");
  const [questionNum, setQuestionNum] = useState("");
  const [requestError, setRequestError] = useState("");

  const { mutate: authMutate } = useMutation<Response, ErrorType>({
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
      } else if (res.data.role != "teacher") {
        router.push("/");
      }
    },
    onError: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    authMutate();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  function isDisabled() {
    if (!questionNum || (!file && !about)) {
      return true;
    }

    if (file && about) {
      return true;
    }

    return false;
  }

  const createExamMutation = useMutation<ExamResponse, Error, ExamCreation>({
    mutationFn: async (data: ExamCreation) => {
      let dataObject;
      let extraObject;
      let url = process.env.NEXT_PUBLIC_BASEURL;

      if (data.file) {
        url += "/exams/create";

        dataObject = new FormData();
        dataObject.append("file", data.file);
        if (data.aditional) {
          dataObject.append("aditional", data.aditional);
        }
        dataObject.append("questionNum", data.questionNum);
        extraObject = {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      } else {
        dataObject = {
          aditional: data.aditional,
          questionNum: data.questionNum,
          about: data.about,
          file: data.file,
        };
        extraObject = {
          withCredentials: true,
        };
        url += "/exams/create-text";
      }
      if (!url) throw Error;

      return axios.post(url, dataObject, extraObject);
    },
    onSuccess: (res: ExamResponse) => {
      const { examName, exam } = res.data;
      console.log(examName, exam);
      const queryString = `name=${examName}&exam=${encodeURIComponent(
        JSON.stringify(exam)
      )}`;
      router.push(`/exams/finalize?${queryString}`);
    },
    onError: (e: ErrorType) => {
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

  function handleSubmit() {
    createExamMutation.mutate({ file, about, aditional, questionNum });
  }

  return (
    <div className=" h-lvh">
      <div className="h-[5%] bg-base-100">
        <Link href={"/teacher-dashboard"}>
          <button className="btn btn-ghost mt-2 ml-2">Quizzy</button>
        </Link>
      </div>
      <main className="bg-base-100 flex flex-col  items-center justify-center w-full h-[95%] gap-5">
        <div className="flex w-full  lg:w-2/3 xl:w-1/2 flex-col border-opacity-50 h-1/2 md:h-1/2 px-3">
          <div className="card bg-base-300 rounded-box grid h-1/2 place-items-center">
            <h2 className="text-center text-wrap px-4">
              Upload a <span className="text-primary">.docx</span> or{" "}
              <span className="text-primary">.pdf</span> file of your notes and{" "}
              <span className="text-primary">AI</span> will generate your quiz.
            </h2>

            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              accept=".docx, .pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="divider">OR</div>
          <div className="card bg-base-300 rounded-box grid h-1/2 place-items-center gap-3 py-4">
            <h2>
              Tell us what the <span className="text-primary">quiz</span> should
              be about.
            </h2>
            <input
              type="text"
              placeholder="e.g. History of Google"
              className="input input-bordered input-primary w-full max-w-xs text-center mb-2"
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
              }}
            />
          </div>
        </div>
        <textarea
          className="textarea textarea-primary w-full max-w-xs text-center"
          placeholder="Aditional requests (leave blank if none)"
          value={aditional}
          onChange={(e) => setAditional(e.target.value)}
        ></textarea>
        <select
          className="select select-primary w-full max-w-xs text-center"
          onChange={(e) => {
            setQuestionNum(e.target.value);
          }}
        >
          <option disabled selected>
            Number of questions
          </option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
          <option value={13}>13</option>
          <option value={14}>14</option>
          <option value={15}>15</option>
          <option value={16}>16</option>
          <option value={17}>17</option>
          <option value={18}>18</option>
          <option value={19}>19</option>
          <option value={20}>20</option>
        </select>
        {requestError && (
          <h4 className="text-red-500 text-center text-wrap">{requestError}</h4>
        )}
        <button
          className={`btn btn-primary mt-2 disabled:border-primary`}
          onClick={handleSubmit}
          disabled={isDisabled() || createExamMutation.isPending}
        >
          {createExamMutation.isPending ? (
            <p className="text-primary">Creating...</p>
          ) : (
            <p>Create</p>
          )}
        </button>
      </main>
    </div>
  );
}
