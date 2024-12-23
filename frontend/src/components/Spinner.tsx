import classNames from "classnames";

type Props = {
  size: "small" | "medium" | "large";
};

function Spinner({ size }: Props) {
  return (
    <div
      className={`border-2 border-b-0 border-awblack rounded-full animate-spin absolute top-1/2 left-1/2 ${classNames(
        {
          "w-7 h-7": size === "small",
          "w-9 h-9": size !== "small",
        }
      )}`}
    />
  );
}

export default Spinner;
