import { Group } from "@/app/student-groups/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Error } from "./RegisterForm";
import { useState } from "react";

export default function StudentGroup(props: Group) {
  const [requestError, setRequestError] = useState("");

  const queryClient = useQueryClient();

  const groupLeaveMutation = useMutation<void, Error, number>({
    mutationFn: async (group_id) => {
      return axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/groups/leave`,
        { group_id },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-groups"] });
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

  function handleGroupLeave() {
    groupLeaveMutation.mutate(props.id);
  }

  return (
    <div className="collapse bg-base-200 w-5/6">
      <input type="checkbox" />
      <div className="collapse-title font-medium">
        <h5 className="text-xl">{props.name}</h5>
        <h5>{props.teacherUsername}</h5>
      </div>
      <div className="collapse-content ">
        <button
          className="btn bg-red-500 text-black hover:bg-base-200 hover:border-red-500 hover:text-white"
          onClick={handleGroupLeave}
        >
          Leave Group
        </button>
        {requestError && (
          <p className="text-red-500 text-center text-wrap">{requestError}</p>
        )}
      </div>
    </div>
  );
}
