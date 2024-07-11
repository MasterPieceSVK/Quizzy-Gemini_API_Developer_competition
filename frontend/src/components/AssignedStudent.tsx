// AssignedStudent.tsx
import { ExamResult } from "@/app/exams/assigned/page";

interface AssignedStudentProps {
  student: ExamResult;
}

export default function AssignedStudent({ student }: AssignedStudentProps) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <h5>{student.username}</h5>
      </div>
      <div className="flex gap-2">
        <h5>{student.finished ? student.score + "%" : "Not Finished"}</h5>
      </div>
    </div>
  );
}
