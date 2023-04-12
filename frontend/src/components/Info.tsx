import { AiFillInfoCircle } from "react-icons/ai";

type Props = {
  title?: string;
  body: string;
  left: number;
  top: number;
};

function Info({ title, body, top, left }: Props) {
  return (
    <div
      className="absolute bg-gray-200 z-50 w-52 p-4 rounded-lg"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        letterSpacing: "1px",
        wordSpacing: "6px",
      }}
    >
      <span className="flex items-center justify-center text-blue-600 text-center py-2 text-xs font-bold">
        <AiFillInfoCircle className="mr-1 text-2xl" /> <span>{title}</span>
      </span>
      <span className="text-xs mt-2 break-all">{body}</span>
    </div>
  );
}

export default Info;
