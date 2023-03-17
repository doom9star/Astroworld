import classNames from "classnames";
import { useCallback, useEffect } from "react";
import { TContinent } from ".";

const continents = [
  ["red", "green", "gray"],
  ["blue", "orange", "pink"],
  ["brown", "cyan", "yellow"],
];

type Props = {
  setContinent: React.Dispatch<React.SetStateAction<TContinent>>;
};

function Map({ setContinent }: Props) {
  const toPosition = useCallback((position: string) => {
    document.getElementById(position)?.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    toPosition("1122");
    setContinent({
      name: continents[1][1],
      cpos: "1,1",
      lpos: "2,2",
    });
  }, [toPosition, setContinent]);

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
      {continents.map((crow, i) => {
        return crow.map((ccol, j) => {
          const _ = [...Array(5)].map(() => [...Array(5).keys()]);
          return (
            <div
              key={ccol}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              {_.reduce((acc, lrow, k) => {
                return acc.concat(
                  lrow.map((lcol) => (
                    <div
                      id={`${i}${j}${k}${lcol}`}
                      key={`${i}${j}${k}${lcol}`}
                      className={
                        "w-[250px] h-[250px] border border-gray-300 " +
                        classNames({
                          "border-t-0 mt-10": i === 0 && k === 0,
                          "border-l-0 ml-10": j === 0 && lcol % 5 === 0,
                          "border-b-0 mb-10": i === 2 && k === 4,
                          "border-r-0 mr-10": j === 2 && (lcol + 1) % 5 === 0,
                        })
                      }
                      onMouseEnter={() =>
                        setContinent({
                          name: ccol,
                          cpos: `${i},${j}`,
                          lpos: `${k},${lcol}`,
                        })
                      }
                    ></div>
                  ))
                );
              }, [] as JSX.Element[])}
            </div>
          );
        });
      })}

      {/* {continents.map((color, i) => (
        <div
          key={color}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          {[...Array(25).keys()].map((j) => (
            <div
              key={`${i}${j}`}
              id={`${i}${j}`}
              className={
                "w-[250px] h-[250px] border border-gray-300 " +
                classNames({
                  "border-t-0 mt-10": i < 3 && j < 5,
                  "border-l-0 ml-10": i % 3 === 0 && j % 5 === 0,
                  "border-b-0 mb-10": i >= 6 && j > 19,
                  "border-r-0 mr-10": (i + 1) % 3 === 0 && (j + 1) % 5 === 0,
                })
              }
              // onMouseEnter={() => setContinent(`${color} (${})`)}
            ></div>
          ))}
        </div>
      ))} */}
    </div>
  );
}

export default Map;
