import { Question } from "@/app/exams/finalize/page";
interface CreateQuestionCardProps {
  question: Question;
  index: number;
  onQuestionChange: (index: number, field: string, value: string) => void;
  onOptionChange: (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  onCorrectChange: (index: number, value: string) => void;
  onQuestionDelete: (index: number) => void;
}

export default function EditQuestionCard({
  question,
  index,
  onQuestionChange,
  onOptionChange,
  onCorrectChange,
  onQuestionDelete,
}: CreateQuestionCardProps) {
  return (
    <div className="collapse bg-base-200 collapse-arrow w-5/6 xl:w-1/2">
      <input type="checkbox" />
      <div className="collapse-title text-base text-wrap">
        {question.question}
      </div>
      <div className="collapse-content flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Type here"
          className="input  w-full text-center"
          defaultValue={question.question}
          value={question.question}
          onChange={(e) => onQuestionChange(index, "question", e.target.value)}
        />
        {question.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className="flex gap-4 justify-center items-center w-full"
          >
            <input
              type="text"
              placeholder={`Answer ${optIndex + 1}`}
              className="input input-bordered w-full"
              value={option}
              onChange={(e) => onOptionChange(index, optIndex, e.target.value)}
            />
            <input
              type="radio"
              name={`radio-${index}`}
              className="radio radio-primary"
              checked={question.correct_option === option}
              onChange={() => onCorrectChange(index, option)}
            />
          </div>
        ))}
        <button
          className="btn btn-outline w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
          onClick={() => onQuestionDelete(index)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
