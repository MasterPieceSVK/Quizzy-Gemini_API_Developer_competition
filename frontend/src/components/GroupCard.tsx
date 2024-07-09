import Link from "next/link";

type GroupType = {
  name: string;
  students_count: number;
  id: number;
};

export default function GroupCard(props: GroupType) {
  return (
    <Link
      href={"/groups/id"}
      className="bg-base-300 flex justify-between w-full md:w-5/6 p-4"
    >
      <h5>Name of group</h5>
      <h5>Number of students</h5>
    </Link>
  );
}
