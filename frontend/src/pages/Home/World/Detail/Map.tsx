import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AiOutlineCaretLeft,
  AiOutlineCaretRight,
  AiOutlineMinus,
  AiOutlineNumber,
} from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import Button from "../../../../components/Button";
import { useGlobalState } from "../../../../redux/slices/global";
import { useWorldState } from "../../../../redux/slices/world";
import {
  EContractStatus,
  EContractType,
  EMapFilterType,
} from "../../../../redux/types";
import { THeader, TSelected } from "./Detail";
import Info from "./Info";

const ZoomMap = { 250: 100, 220: 75, 190: 50, 160: 25 };

type Props = {
  setHeader: React.Dispatch<React.SetStateAction<THeader>>;
  toLand: (position?: string, id?: string) => void;
  selected: TSelected;
  setSelected: React.Dispatch<React.SetStateAction<TSelected>>;
};

function Map({ setHeader, toLand, selected, setSelected }: Props) {
  const [zoom, setZoom] = useState(250);
  const [mapFilter, setMapFilter] = useState<EMapFilterType>(
    EMapFilterType.ALL
  );
  const [currentFilteredLand, setCurrentFilteredLand] = useState(-1);

  const { world } = useWorldState();
  const { user } = useGlobalState();
  const toLandRef = useRef(toLand);
  const { state } = useLocation();

  const filteredLands = useMemo(() => {
    let lands: string[] = [];
    if (world) {
      if (mapFilter === EMapFilterType.TERRITORY) {
        world.continents.forEach((c) => {
          lands = [
            ...lands,
            ...c.lands
              .filter((l) => l.owner.id === user?.id)
              .map((l) => `${c.position} ${l.position}`),
          ];
        });
      } else if (mapFilter === EMapFilterType.BUY) {
        world.continents.forEach((c) => {
          lands = [
            ...lands,
            ...c.lands
              .filter((l) =>
                l.contracts.some(
                  (_c) =>
                    _c.type === EContractType.LAND_BUY &&
                    _c.status === EContractStatus.PENDING &&
                    _c.from.id === user?.id
                )
              )
              .map((l) => `${c.position} ${l.position}`),
          ];
        });
      } else if (mapFilter === EMapFilterType.SALE) {
        world.continents.forEach((c) => {
          lands = [
            ...lands,
            ...c.lands
              .filter((l) =>
                l.contracts.some(
                  (_c) =>
                    _c.type === EContractType.LAND_SALE &&
                    _c.status === EContractStatus.PENDING &&
                    _c.to.id === user?.id
                )
              )
              .map((l) => `${c.position} ${l.position}`),
          ];
        });
      }
    }
    setCurrentFilteredLand(mapFilter === EMapFilterType.ALL ? -1 : 0);
    return lands;
  }, [mapFilter, world, user]);

  useEffect(() => {
    if (state) {
      toLandRef.current(undefined, state as string);
    } else {
      toLandRef.current("1 1 2 2");
    }
  }, [state]);

  useEffect(() => {
    if (currentFilteredLand !== -1) {
      toLandRef.current(filteredLands[currentFilteredLand]);
    }
  }, [filteredLands, currentFilteredLand]);

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
      <div className="fixed top-[23%] right-[10%] flex flex-col items-center">
        <div className="flex items-center">
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
              disabled: zoom <= 160,
              className: `mr-2 ${classNames({
                "opacity-30": zoom <= 160,
              })}`,
            }}
          />
          <span className="text-xs">{(ZoomMap as any)[zoom]}%</span>
        </div>
        <div className="flex items-center">
          <select
            name="mapFilter"
            className="w-full p-2 mr-2 text-xs bg-white border my-2"
            onChange={(e) => setMapFilter(e.target.value as EMapFilterType)}
          >
            <option value={EMapFilterType.ALL}>All</option>
            <option value={EMapFilterType.TERRITORY}>Territory</option>
            <option value={EMapFilterType.BUY}>Buy</option>
            <option value={EMapFilterType.SALE}>Sale</option>
          </select>
          <div className="flex items-center cursor-pointer">
            <Button
              icon={<AiOutlineCaretLeft />}
              btnProps={{
                onClick: () => setCurrentFilteredLand(currentFilteredLand - 1),
                disabled: currentFilteredLand < 1,
                className: `mr-1 ${classNames({
                  "text-gray-400": currentFilteredLand < 1,
                })}`,
              }}
            />
            <Button
              icon={<AiOutlineCaretRight />}
              btnProps={{
                onClick: () => setCurrentFilteredLand(currentFilteredLand + 1),
                disabled: currentFilteredLand === filteredLands.length - 1,
                className: `${classNames({
                  "text-gray-400":
                    currentFilteredLand === filteredLands.length - 1,
                })}`,
              }}
            />
          </div>
        </div>
        {filteredLands.length > 0 && (
          <span
            className="text-xs flex items-center cursor-pointer"
            onClick={() => toLand(filteredLands[currentFilteredLand])}
          >
            <AiOutlineNumber className="mr-2" /> {currentFilteredLand + 1} /{" "}
            {filteredLands.length}
          </span>
        )}
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
                    "bg-gray-100":
                      selected?.land.id === l.id ||
                      filteredLands.includes(`${c.position} ${l.position}`),
                    " bg-gray-50":
                      currentFilteredLand !== -1 &&
                      filteredLands[currentFilteredLand] ===
                        `${c.position} ${l.position}`,
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
