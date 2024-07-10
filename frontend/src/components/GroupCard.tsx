import Link from "next/link";
import { StudentIcon } from "./icons/StudentIcon";
import { InviteCodeIcon } from "./icons/InviteCodeIcon";
import { useEffect, useState } from "react";
import { Student } from "@/app/teacher-groups/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Error } from "./RegisterForm";

type GroupType = {
  name: string;
  studentCount: number;
  invite_code: string;
  id: number;
  students: Student[];
  assign?: boolean;
  exam_id?: number;
};

type DeleteResponse = {
  data: {
    success: boolean;
  };
};

type AssignInput = {
  group_id: number;
  user_ids: number[];
};

export default function GroupCard(props: GroupType) {
  const [isCopied, setIsCopied] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [areYouSure, setAreYouSure] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const queryClient = useQueryClient();

  const handleCopyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const deleteGroupMutation = useMutation<DeleteResponse, Error, number>({
    mutationFn: async (id: number) => {
      return axios.delete(`${process.env.NEXT_PUBLIC_BASEURL}/groups/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      setAreYouSure(false);
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

  function handleGroupDelete() {
    if (props.id !== null) {
      deleteGroupMutation.mutate(props.id);
    }
  }

  const assignQuizMutation = useMutation<DeleteResponse, Error, AssignInput>({
    mutationFn: async (data) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/exams/assign`,
        data,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      setAssigned(true);
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

  function handleAssign() {
    const dataObject = {
      group_id: props.id,
      user_ids: props.students.map((student) => student.id),
      exam_id: props.exam_id,
    };

    assignQuizMutation.mutate(dataObject);
  }

  return (
    <div className="bg-base-300 collapse w-full md:w-5/6 p-4">
      <input type="checkbox" />
      <div className="collapse-title text-lg font-medium flex justify-between items-center">
        <h5>{props.name}</h5>
        {requestError && (
          <h5 className="text-red-500 text-center text-wrap">{requestError}</h5>
        )}
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <InviteCodeIcon size={20} />
            <h5
              onClick={() => handleCopyInviteCode(props.invite_code)}
              className="cursor-pointer z-10"
            >
              {isCopied ? (
                <span className="text-primary ml-2">Copied!</span>
              ) : (
                <p>{props.invite_code}</p>
              )}
            </h5>
          </div>
          <div className="flex items-center">
            <StudentIcon size={20} />
            <h5>{props.studentCount}</h5>
          </div>
          {props.assign && (
            <div className="z-10 h-full">
              <button
                className="btn btn-ghost border-primary border-2 h-full hover:bg-primary hover:text-black disabled:border-primary disabled:text-primary"
                onClick={handleAssign}
                disabled={assigned || props.studentCount === 0}
              >
                {props.studentCount === 0
                  ? "Empty"
                  : !assigned
                  ? "Assign"
                  : "Assigned"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="collapse-content">
        <div className="flex flex-col gap-2">
          {props.students &&
            props.students.map((student, i) => (
              <div className="flex items-center gap-2" key={i}>
                <StudentIcon size={20} />
                <h5>{student.username}</h5>
                -&gt;
                <h5>{student.email}</h5>
              </div>
            ))}
          {(props.students.length === 0 || !props.students) && (
            <h5 className="text-white">
              Invite your students by clicking on the 6-digit invite code and
              sending it to them.
            </h5>
          )}
          <div className="flex justify-center mt-4">
            <div className="flex justify-end w-full">
              {!areYouSure ? (
                <button
                  className="btn bg-base-100 border-red-500 text-red-500 hover:text-black hover:bg-red-500 mr-6"
                  onClick={() => {
                    setAreYouSure(true);
                  }}
                >
                  Delete
                </button>
              ) : (
                <button
                  className="btn bg-base-100 border-red-500 text-red-500 hover:text-black hover:bg-red-500 mr-6"
                  onClick={handleGroupDelete}
                >
                  Are you sure?
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
