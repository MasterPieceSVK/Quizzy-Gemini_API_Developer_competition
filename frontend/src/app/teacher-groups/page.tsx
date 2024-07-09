"use client";
import { Response } from "@/components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [groupName, setGroupName] = useState("");
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

  const createGroupMutation = useMutation<Response, Error, string>({
    mutationFn: async (name) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/groups/create`,
        { name },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: () => {
      router.push("/");
    },
  });

  function handleCreateGroup() {
    createGroupMutation.mutate(groupName);
  }
  return (
    <div className="bg-base-100">
      <nav>
        <Link href={"/teacher-dashboard"}>
          <button className="btn btn-ghost mt-2 ml-2">Back</button>
        </Link>
      </nav>
      <main className="flex flex-col items-center w-full gap-5">
        <h1>Your groups</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <Link
            href={"/groups/id"}
            className="bg-base-300 flex justify-between w-full md:w-5/6 p-4"
          >
            <h5>Name of group</h5>
            <h5>Number of students</h5>
          </Link>
          <Link
            href={"/groups/id"}
            className="bg-base-300 flex justify-between w-full md:w-5/6 p-4"
          >
            <h5>Name of group</h5>
            <h5>Number of students</h5>
          </Link>
        </div>
        <button
          className="btn btn-primary mb-5"
          onClick={() => {
            const modal = document.getElementById(
              "my_modal_2"
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          Create new group
        </button>
        <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box ">
            <h3 className="font-bold text-lg">Name of the group</h3>
            <div className="flex justify-center items-center mt-3">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs "
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button
                className="btn btn-primary ml-3"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>
      </main>
    </div>
  );
}
