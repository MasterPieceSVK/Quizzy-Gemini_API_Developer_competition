// AssignedGroup.tsx
import { Group } from "@/app/exams/assigned/page";
import AssignedStudent from "./AssignedStudent";

interface AssignedGroupProps {
  group: Group;
}

export default function AssignedGroup({ group }: AssignedGroupProps) {
  const avgScore =
    group.reduce((acc, curr) => acc + curr.score, 0) / group.length;

  return (
    <div className="collapse bg-base-300">
      <input type="checkbox" />
      <div className="collapse-title  font-medium flex justify-between">
        <h6>{group[0]?.group_name}</h6>
        <h6>Avg score: {avgScore}</h6>
      </div>
      <div className="collapse-content flex flex-col">
        {group.map((student, i) => (
          <AssignedStudent key={i} student={student} />
        ))}
      </div>
    </div>
  );
}
