"use client";
import { Error } from "@/components/RegisterForm";
import StudentGroup from "@/components/StudentGroup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Group = {
  id: number;
  name: string;
  teacher_id: number;
  invite_code: string;
  teacherUsername: string;
};

type GroupResponse = {
  data: Group[];
  status: number;
};

export default function Page() {
  const [inviteCode, setInviteCode] = useState("");
  const [requestError, setRequestError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [noGroupsJoined, setNoGroupsJoined] = useState(false);
  const [groups, setGroups] = useState<Group[]>();

  const router = useRouter();
  const queryClient = useQueryClient();

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
      console.log(res);
    },
    onError: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    authMutate();
  }, []);

  const groupJoinMutation = useMutation<Response, Error, string>({
    mutationFn: async (invite_code) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/groups/join`,
        { invite_code },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (res: Response) => {
      setRequestError("");
      setJoinSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["student-groups"] });
    },
    onError: (e: Error) => {
      console.log(e);
      setJoinSuccess(false);
      if (e.response?.data) {
        setRequestError(e.response.data.error);
      } else if (e.code === "ERR_NETWORK") {
        setRequestError("Network error. The server may be down.");
      } else if (e.message) {
        setRequestError(e.message);
      }
    },
  });

  function handleGroupJoin() {
    groupJoinMutation.mutate(inviteCode);
  }

  const { isPending } = useQuery({
    queryKey: ["student-groups"],
    queryFn: () =>
      axios
        .get(`${process.env.NEXT_PUBLIC_BASEURL}/groups/students`, {
          withCredentials: true,
        })
        .then((res: GroupResponse) => {
          if (res.status === 204) {
            setNoGroupsJoined(true);
            return;
          } else {
            setGroups(res.data);
          }
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
    <div className="bg-base-100 mt-3">
      <main className="flex flex-col justify-center items-center w-full gap-3">
        <h4 className="text-xl">Join a group?</h4>
        <div className="flex flex-col">
          <div className="flex">
            <input
              type="text"
              placeholder="Invite code here"
              className="input input-bordered input-primary w-full max-w-xs"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
            <button
              className="btn btn-primary ml-3 rounded-tr-3xl rounded-none disabled:border-primary"
              onClick={handleGroupJoin}
              disabled={!inviteCode}
            >
              Join
            </button>
          </div>
          {requestError && (
            <p className="text-red-500 text-center text-wrap mt-4">
              {requestError}
            </p>
          )}
          {joinSuccess && (
            <p className="text-green-500 text-center text-wrap mt-4">
              You successfully joined a group
            </p>
          )}
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          {noGroupsJoined && (
            <p className="text-center text-wrap text-lg">
              You aren&apos;t part of any group
            </p>
          )}
          {isPending && (
            <p className="text-center text-wrap text-lg">
              Fetching your groups...
            </p>
          )}

          {groups &&
            groups.map((group, i) => {
              return <StudentGroup key={i} {...group} />;
            })}
        </div>
      </main>
    </div>
  );
}
