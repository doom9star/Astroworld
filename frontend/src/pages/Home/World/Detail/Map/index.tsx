import classNames from "classnames";
import { useEffect } from "react";
import { THeader, TSelected } from "../";
import { useWorldState } from "../../../../../redux/slices/world";
import { ELandType } from "../../../../../redux/types";
import LandDetail from "./LandDetail";

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position: string) => void;
  selected: TSelected;
  setSelected: React.Dispatch<React.SetStateAction<TSelected>>;
};

function Map({ setHeader, toLand, selected, setSelected }: Props) {
  const { world } = useWorldState();

  useEffect(() => {
    toLand("1 1 2 2");
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        maxWidth: "100vw",
        maxHeight: "80vh",
        overflow: "scroll",
        position: "relative",
      }}
    >
      {selected && (
        <LandDetail selected={selected} onClose={() => setSelected(null)} />
      )}
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
                className={
                  "w-[250px] h-[250px] relative border border-gray-200 cursor-pointer hover:bg-gray-100 " +
                  classNames({
                    "border-t-0 mt-10": i < 3 && j < 5,
                    "border-l-0 ml-10": i % 3 === 0 && j % 5 === 0,
                    "border-b-0 mb-10": i > 5 && j > 19,
                    "border-r-0 mr-10": (i + 1) % 3 === 0 && (j + 1) % 5 === 0,
                    "bg-gray-100": selected?.land.id === l.id,
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
                  setSelected({ land: l, continent: c });
                }}
              >
                {l.type === ELandType.CAPITAL && (
                  <>
                    <img
                      src={l.thumbnail.url}
                      alt="Decoration"
                      className="opacity-80"
                    />
                    <img
                      src={l.capital?.thumbnail.url}
                      alt="Capital"
                      className="absolute top-8 z-10"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Map;
