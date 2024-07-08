import { Exam } from "@/app/teacher-dashboard/page";
import Link from "next/link";

export default function ExamCard(props: Exam) {
  return (
    <Link href={`/exam/${props.id}`}>
      <div className="bg-base-300  flex justify-between p-5">
        <h4>{props.title}</h4>
        <h5># of QA: {props.questionCount}</h5>
      </div>
    </Link>
  );
}
