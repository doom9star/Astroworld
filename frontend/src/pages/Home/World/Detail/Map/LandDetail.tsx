import classNames from "classnames";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useWorldState } from "../../../../../redux/slices/world";
import { IContinent, ILand } from "../../../../../redux/types";

type Props = {
  landDetail: { land: ILand; continent: IContinent };
  onClose: () => void;
};

function LandDetail({ onClose, landDetail }: Props) {
  const { world } = useWorldState();
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={containerRef}
      className="slideLeft flex flex-col border fixed right-0 top-[20%] shadow-lg bg-white w-[30%] h-[100%] p-4"
    >
      <span
        className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
        onClick={() => {
          containerRef.current!.classList.add("slideRight");
          setTimeout(() => {
            onClose();
          }, 300);
        }}
      >
        x
      </span>
      <div className="mt-5 px-10">
        <div className="flex justify-between text-xs">
          <span>land</span>
          <span className="font-bold" style={{ fontSize: "0.7rem" }}>
            {landDetail.land.id}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>area</span>
          <span className="font-bold">
            {landDetail.land.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>position</span>
          <span className="font-bold">{`(${landDetail.land.position})`}</span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>cost</span>
          <span className="text-xs font-bold flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            &nbsp;
            {landDetail.land.cost}
          </span>
        </div>
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span>continent</span>
          <span className="font-bold">
            {landDetail.continent.name.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>area</span>
          <span className="font-bold">
            {landDetail.continent.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>position</span>
          <span className="font-bold">{`(${landDetail.continent.position})`}</span>
        </div>
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span>owner</span>
          <span className="font-bold">{world?.name}</span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span>status</span>
          <span className="font-bold text-green-600">available</span>
        </div>
      </div>
      <Link to={"#"} className="self-center my-10">
        <button
          type={"button"}
          className={`button py-1 mt-1 w-14 ${classNames({
            "opacity-60": false,
          })}`}
          style={{ fontSize: "0.6rem" }}
        >
          {false && <div className="spinner" />}
          Buy
        </button>
      </Link>
    </div>
  );
}

export default LandDetail;
