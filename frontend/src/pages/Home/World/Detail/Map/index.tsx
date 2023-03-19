import classNames from "classnames";
import { useEffect, useState } from "react";
import { THeader } from "../";
import { useWorldState } from "../../../../../redux/slices/world";
import { IContinent, ILand } from "../../../../../redux/types";
import LandDetail from "./LandDetail";

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position: string) => void;
};

function Map({ setHeader, toLand }: Props) {
  const { world } = useWorldState();
  const [landDetail, setLandDetail] = useState<{
    land: ILand;
    continent: IContinent;
  } | null>(null);

  useEffect(() => {
    toLand("1 1 2 2");
  }, [toLand]);

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
      {landDetail && (
        <LandDetail
          landDetail={landDetail}
          onClose={() => setLandDetail(null)}
        />
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
                data-continent={c.name}
                data-lcost={l.cost}
                className={
                  "w-[250px] h-[250px] border border-gray-300 cursor-pointer hover:bg-gray-100 " +
                  classNames({
                    "border-t-0 mt-10": i < 3 && j < 5,
                    "border-l-0 ml-10": i % 3 === 0 && j % 5 === 0,
                    "border-b-0 mb-10": i > 5 && j > 19,
                    "border-r-0 mr-10": (i + 1) % 3 === 0 && (j + 1) % 5 === 0,
                    "bg-gray-100": landDetail?.land.id === l.id,
                  })
                }
                onMouseEnter={() =>
                  setHeader({
                    cname: c.name,
                    cpos: c.position,
                    lpos: l.position,
                    lcost: l.cost,
                  })
                }
                onClick={() => {
                  toLand(`${c.position} ${l.position}`);
                  setLandDetail({ land: l, continent: c });
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
