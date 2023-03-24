import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useWorldState } from "../../../../redux/slices/world";
import { THeader, TSelected } from "./Detail";
import LandDetail from "./Info";

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position: string) => void;
  selected: TSelected;
  setSelected: React.Dispatch<React.SetStateAction<TSelected>>;
};

function Map({ setHeader, toLand, selected, setSelected }: Props) {
  const [zoom, setZoom] = useState(250);

  const { world } = useWorldState();
  const toLandRef = useRef(toLand);

  useEffect(() => {
    toLandRef.current("1 1 2 2");
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
      <div className="fixed top-[23%] right-[10%] z-10">
        <button
          type={"button"}
          className={`button px-1 py-0 w-8 mr-2 text-lg ${classNames({
            "opacity-60": zoom >= 250,
          })}`}
          disabled={zoom >= 250}
          onClick={() => setZoom(zoom + 30)}
        >
          {false && <div className="spinner" />}+
        </button>
        <button
          type={"button"}
          className={`button px-1 text-lg py-0 w-8 ${classNames({
            "opacity-60": zoom <= 150,
          })}`}
          onClick={() => setZoom(zoom - 30)}
          disabled={zoom <= 150}
        >
          {false && <div className="spinner" />}-
        </button>
      </div>
      {selected && (
        <LandDetail selected={selected} onClose={() => setSelected(null)} />
      )}
      {world?.continents.map((c) => {
        return (
          <div
            key={c.id}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            {c.lands.map((l) => (
              <div
                id={`${c.position} ${l.position}`}
                key={`${c.position} ${l.position}`}
                className={
                  `relative cursor-pointer hover:bg-gray-100 ` +
                  classNames({
                    //   "border-t-0 mt-10": i < 3 && j < 5,
                    //   "border-l-0 ml-10": i % 3 === 0 && j % 5 === 0,
                    //   "border-b-0 mb-10": i > 5 && j > 19,
                    //   "border-r-0 mr-10": (i + 1) % 3 === 0 && (j + 1) % 5 === 0,
                    "bg-gray-100": selected?.land.id === l.id,
                  })
                }
                style={{
                  width: `${zoom}px`,
                  height: `${zoom}px`,
                  transition: "all 1s",
                }}
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
                {l.thumbnail && (
                  <img
                    src={l.thumbnail.url}
                    alt="Decoration"
                    className="w-full h-full"
                  />
                )}
                {l.capital && (
                  <img
                    src={l.capital.thumbnail.url}
                    alt="Capital"
                    className="pt-8"
                  />
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
