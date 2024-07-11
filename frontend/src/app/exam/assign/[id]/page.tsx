"use client";
import GroupCard from "@/components/GroupCard";
import { Error, Response } from "@/components/RegisterForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Student = {
  id: number;
  username: string;
  email: string;
};

type Group = {
  id: number;
  name: string;
  invite_code: string;
  teacher_id: number;
  studentCount: number;
  students: Student[];
  assign: boolean;
  exam_id: number;
};

type GroupResponse = {
  data: Group[];
};

export default function Page({ params }: { params: { id: string } }) {
  const [groupName, setGroupName] = useState("");
  const [requestError, setRequestError] = useState("");
  const [noGroups, setNoGroups] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();

  const exam_id = Number(params.id);

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

  const createGroupMutation = useMutation<GroupResponse, Error, string>({
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
      queryClient.invalidateQueries({ queryKey: ["groups"] });
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

  function handleCreateGroup() {
    if (groupName) {
      const modal = document.getElementById(
        "my_modal_4"
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
      createGroupMutation.mutate(groupName);
    }
  }

  const { isPending } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASEURL}/groups/unassigned/${exam_id}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setGroups(res.data);
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
          <button className="btn btn-ghost mt-2 ml-2">Back</button>
        </Link>
      </nav>
      <main className="flex flex-col items-center w-full gap-5">
        <h1 className="text-xl">Your groups</h1>
        {isPending && (
          <p className="text-white text-center">Fetching your groups...</p>
        )}
        {requestError && (
          <p className="text-red-500 text-center text-wrap text-lg">
            {requestError}
          </p>
        )}
        <div className="flex flex-col items-center w-full gap-3">
          {groups.length === 0 && !isPending && (
            <p className="text-white text-center">
              You don&apos;t have any groups to assign to
            </p>
          )}
          {groups &&
            groups.map((group, i) => {
              group.assign = true;
              group.exam_id = exam_id;
              return <GroupCard key={i} {...group} />;
            })}
        </div>
        <button
          className="btn btn-primary mb-5"
          onClick={() => {
            const modal = document.getElementById(
              "my_modal_4"
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          Create new group
        </button>
        <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
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
                className="btn btn-primary ml-3 disabled:border-primary disabled:text-primary"
                onClick={handleCreateGroup}
                disabled={!groupName}
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
