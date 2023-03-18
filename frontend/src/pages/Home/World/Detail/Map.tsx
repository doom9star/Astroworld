import classNames from "classnames";
import { useEffect } from "react";
import { THeader } from ".";
import { useWorldState } from "../../../../redux/slices/world";

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position: string) => void;
};

function Map({ setHeader, toLand }: Props) {
  const { world } = useWorldState();

  useEffect(() => {
    toLand("1 1 2 2");
    setHeader({
      cname: world?.continents[4].name || "",
      cpos: "1 1",
      lpos: "2 2",
    });
  }, [toLand, setHeader, world?.continents]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        maxWidth: "100vw",
        maxHeight: "80vh",
        overflow: "scroll",
      }}
    >
      {world?.continents.map((c, i) => {
        return (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            {c.lands.map((l, j) => (
              <div
                id={`${c.position} ${l.position}`}
                key={`${c.position} ${l.position}`}
                data-continent={c.name}
                className={
                  "w-[250px] h-[250px] border border-gray-300 " +
                  classNames({
                    "border-t-0 mt-10": i < 3 && j < 5,
                    "border-l-0 ml-10": i % 3 === 0 && j % 5 === 0,
                    "border-b-0 mb-10": i > 5 && j > 19,
                    "border-r-0 mr-10": (i + 1) % 3 === 0 && (j + 1) % 5 === 0,
                  })
                }
                onMouseEnter={() =>
                  setHeader({
                    cname: c.name,
                    cpos: c.position,
                    lpos: l.position,
                  })
                }
                onClick={() => {
                  toLand(`${c.position} ${l.position}`);
                }}
              ></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Map;
