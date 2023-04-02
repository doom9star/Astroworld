import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { AiOutlineMinus } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import Button from "../../../../components/Button";
import { useWorldState } from "../../../../redux/slices/world";
import { THeader, TSelected } from "./Detail";
import Info from "./Info";

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position?: string, id?: string) => void;
  selected: TSelected;
  setSelected: React.Dispatch<React.SetStateAction<TSelected>>;
};

function Map({ setHeader, toLand, selected, setSelected }: Props) {
  const [zoom, setZoom] = useState(250);

  const { world } = useWorldState();
  const toLandRef = useRef(toLand);
  const { state } = useLocation();

  useEffect(() => {
    if (state) {
      toLandRef.current(undefined, state as string);
    } else {
      toLandRef.current("1 1 2 2");
    }
  }, [state]);

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
      <div className="fixed top-[23%] right-[10%] flex">
        <Button
          icon={<GrAdd />}
          linkProps={{
            className: "mr-2",
          }}
          btnProps={{
            onClick: () => setZoom(zoom + 30),
            disabled: zoom >= 250,
            className: `${classNames({
              "opacity-30": zoom >= 250,
            })}`,
          }}
        />
        <Button
          icon={<AiOutlineMinus />}
          btnProps={{
            onClick: () => setZoom(zoom - 30),
            disabled: zoom <= 150,
            className: `${classNames({
              "opacity-30": zoom <= 150,
            })}`,
          }}
        />
      </div>
      {selected && (
        <Info selected={selected} onClose={() => setSelected(null)} />
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
                id={l.id}
                data-position={`${c.position} ${l.position}`}
                key={`${c.position} ${l.position}`}
                className={
                  `cursor-pointer hover:bg-gray-100 ` +
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
