import { Quiz } from "@/app/student-dashboard/page";
import Link from "next/link";

export default function StudentQuizCard(props: Quiz) {
  return (
    <div className="bg-base-200 w-5/6 p-4 flex justify-between items-center gap-3">
      <div>
        <h5 className="text-xl">{props.title}</h5>
        <h5 className="text-lg">{props.groupName}</h5>
        <h5 className="text-lg">{props.teacherUsername}</h5>
      </div>
      {!props.finished ? (
        <Link href={`/exam/take/${props.exam_id}`}>
          <button className="btn btn-ghost border-primary border-2">
            Take
          </button>
        </Link>
      ) : (
        <p className="text-2xl">{props.score}%</p>
      )}
    </div>
  );
}
