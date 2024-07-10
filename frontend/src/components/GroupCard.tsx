import Link from "next/link";
import { StudentIcon } from "./icons/StudentIcon";
import { InviteCodeIcon } from "./icons/InviteCodeIcon";
import { useState } from "react";

type GroupType = {
  name: string;
  studentCount: number;
  invite_code: string;
  id: number;
};

export default function GroupCard(props: GroupType) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-base-300 flex justify-between w-full md:w-5/6 p-4">
      <Link href={`/groups/${props.id}`}>
        <h5>{props.name}</h5>
      </Link>

      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <InviteCodeIcon size={20} />
          <h5
            onClick={() => handleCopyInviteCode(props.invite_code)}
            className="cursor-pointer"
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
      </div>
    </div>
  );
}
