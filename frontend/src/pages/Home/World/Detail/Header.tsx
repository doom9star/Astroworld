import { TContinent } from ".";

type Props = {
  continent: TContinent;
};

function Header({ continent }: Props) {
  return (
    <div className="pb-4 text-gray-700 font-bold absolute top-20 w-[100vw] text-center">
      <span
        className="text-5xl"
        style={{
          WebkitTextStrokeWidth: "2px",
          WebkitTextFillColor: "transparent",
        }}
      >
        {continent.name}
      </span>
      <p className="p-2">
        <span className="mr-4">c: {`(${continent.cpos})`}</span>
        <span>l: {`(${continent.lpos})`}</span>
      </p>
    </div>
  );
}

export default Header;
