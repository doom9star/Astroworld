import classNames from "classnames";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { TSelected } from "..";
import { useWorldState } from "../../../../../redux/slices/world";

type Props = {
  selected: Exclude<TSelected, null>;
  onClose: () => void;
};

function LandDetail({ onClose, selected }: Props) {
  const { world } = useWorldState();
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={containerRef}
      className="slideLeft flex flex-col border fixed right-0 top-[23%] z-50 shadow-lg bg-white w-[30%] h-[70%] p-4 font-mono"
    >
      <span
        className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
        onClick={() => {
          containerRef.current!.classList.add("slideRight");
          setTimeout(() => {
            onClose();
          }, 290);
        }}
      >
        x
      </span>
      <div className="mt-5 px-10">
        <div className="text-xs mb-10 text-center">
          <span
            className={
              "font-bold" +
              classNames({
                " text-lg": !!selected.land.capital,
              })
            }
          >
            {selected.land.capital ? "CAPITAL" : selected.land.id}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>area</span>
          <span className="font-bold">
            {selected.land.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>position</span>
          <span className="font-bold">{`(${selected.land.position})`}</span>
        </div>
        {selected.land.available && (
          <div className="flex justify-between my-2 text-xs">
            <span>cost</span>
            <span className="text-xs font-bold flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              &nbsp;
              {selected.land.cost}
            </span>
          </div>
        )}
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span>continent</span>
          <span className="font-bold">
            {selected.continent.name.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>area</span>
          <span className="font-bold">
            {selected.continent.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>position</span>
          <span className="font-bold">{`(${selected.continent.position})`}</span>
        </div>
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span>owner</span>
          <span className="font-bold">{selected.land.owner.email}</span>
        </div>
        {selected.land.capital && (
          <div className="flex justify-between my-2 text-xs">
            <span>status</span>
            {selected.land.capital.operating ? (
              <span className="font-bold text-green-600">open</span>
            ) : (
              <span className="font-bold text-red-600">closed</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <Link to={"#"}>
          <button
            type={"button"}
            className={`button p-1 mr-4 w-14 ${classNames({
              "opacity-60": false,
            })}`}
            style={{ fontSize: "0.6rem" }}
          >
            {false && <div className="spinner" />}
            Visit
          </button>
        </Link>
        {selected.land.available && (
          <Link to={"#"}>
            <button
              type={"button"}
              className={`button p-1 w-14 ${classNames({
                "opacity-60": false,
              })}`}
              style={{ fontSize: "0.6rem" }}
            >
              {false && <div className="spinner" />}
              Buy
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default LandDetail;
