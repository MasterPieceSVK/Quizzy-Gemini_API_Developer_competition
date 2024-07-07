"use client";

import { Error, Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
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

  return (
    <div className=" h-lvh">
      <div className="h-[5%] bg-base-100">
        <button className="btn btn-ghost mt-2 ml-2">Quizzy</button>
      </div>
      <main className="bg-base-100 flex flex-col  items-center justify-center w-full h-[95%] gap-5">
        <div className="flex w-full  lg:w-2/3 xl:w-1/2 flex-col border-opacity-50 h-3/4 md:h-1/2 px-3">
          <div className="card bg-base-300 rounded-box grid h-1/2 place-items-center">
            <h2 className="text-center text-wrap px-4">
              Upload a <span className="text-primary">.docx</span> or{" "}
              <span className="text-primary">.pdf</span> file of your notes and{" "}
              <span className="text-primary">AI</span> will generate your exam.
            </h2>

            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
          </div>
          <div className="divider">OR</div>
          <div className="card bg-base-300 rounded-box grid h-1/2 place-items-center gap-3 py-4">
            <h2>Tell us what the exam should be about.</h2>
            <input
              type="text"
              placeholder="e.g. History of Google"
              className="input input-bordered input-primary w-full max-w-xs text-center mb-2"
            />
            <textarea
              className="textarea textarea-primary w-full max-w-xs text-center"
              placeholder="Aditional requests (leave blank if none)"
            ></textarea>
            <button className="btn btn-primary mt-2 ml-2">Create</button>
          </div>
        </div>
      </main>
    </div>
  );
}
