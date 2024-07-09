import { Question } from "@/app/exams/finalize/page";

export default function QuestionCard(props: Question) {
  return (
    <div
      className="bg-base-300 p-4 flex flex-col items-center gap-3 w-full lg:w-5/6"
      key={props.id}
    >
      <h3 className="text-base text-center text-wrap">{props.question}</h3>
      <ul className="flex flex-col gap-1 w-full">
        {props.options.map((option, i) => (
          <li
            key={i}
            className={`${
              option === props.correct_option && "bg-green-500"
            } rounded-xl text-center px-4`}
          >
            &gt; {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
