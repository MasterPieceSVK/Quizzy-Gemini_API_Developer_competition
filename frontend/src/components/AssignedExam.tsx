// AssignedExam.tsx
import { Exam } from "@/app/exams/assigned/page";
import AssignedGroup from "./AssignedGroup";

interface AssignedExamProps {
  exam: Exam;
}

export default function AssignedExam({ exam }: AssignedExamProps) {
  return (
    <div>
      <div className="collapse bg-base-200">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          {exam[0]?.[0]?.exam_name}
        </div>
        <div className="collapse-content">
          <h5 className="text-center mb-3">
            Tip: Click on the group to show the students and their scores
          </h5>
          <div className="flex flex-col gap-2">
            {exam.map((group, i) => (
              <AssignedGroup key={i} group={group} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
