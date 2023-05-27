import classNames from "classnames";
import { useMemo, useRef } from "react";
import { AiOutlineAlignCenter } from "react-icons/ai";
import { BiCoin } from "react-icons/bi";
import { FaPlaceOfWorship, FaUserTie, FaWrench } from "react-icons/fa";
import { GiBuyCard } from "react-icons/gi";
import { GrLocation, GrStatusGood } from "react-icons/gr";
import { ImFileText } from "react-icons/im";
import { MdOutlineSell } from "react-icons/md";
import { TiChartAreaOutline } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import Button from "../../../../components/Button";
import { useGlobalState } from "../../../../redux/slices/global";
import {
  EContractStatus,
  EContractType,
  ELandType,
} from "../../../../redux/types";
import { TSelected } from "./Detail";
import { BsCircleFill } from "react-icons/bs";

type Props = {
  selected: Exclude<TSelected, null>;
  onClose: () => void;
};

function Info({ onClose, selected }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useGlobalState();
  const { pathname } = useLocation();

  const pendingContract = useMemo(() => {
    const contract = selected.land.contracts.find(
      (c) =>
        ((c.from || c.to).id === user?.id ||
          c.type === EContractType.LAND_SALE) &&
        c.status === EContractStatus.PENDING
    );
    return contract;
  }, [selected, user]);

  const isOwner = useMemo(() => {
    return user?.id === selected.land.owner.id;
  }, [user, selected.land]);

  const viewContract = useMemo(() => {
    return isOwner && selected.land.contracts.length > 0;
  }, [selected, isOwner]);

  const underConstruction = useMemo(() => {
    return (
      selected.land.shelter &&
      new Date().getTime() <= new Date(selected.land.shelter.built).getTime()
    );
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="slideLeft flex flex-col border fixed right-0 top-[23%] shadow-lg bg-white w-[30%] h-[70%] p-4 font-mono"
    >
      <span
        className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
        onClick={() => {
          containerRef.current!.classList.add("slideRight");
          setTimeout(() => {
            onClose();
          }, 250);
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
          <span className="flex">
            <TiChartAreaOutline className="mr-2" /> area
          </span>
          <span className="font-bold">
            {selected.land.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span className="flex">
            <GrLocation className="mr-2" /> position
          </span>
          <span className="font-bold">{`(${selected.land.position})`}</span>
        </div>
        {selected.land.available && (
          <div className="flex justify-between my-2 text-xs">
            <span className="flex">
              <BiCoin className="mr-2" />
              value
            </span>
            <span className="text-xs font-bold flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              &nbsp;
              {selected.land.value.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span className="flex">
            <FaPlaceOfWorship className="mr-2" /> continent
          </span>
          <span className="font-bold">
            {selected.continent.name.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span className="flex">
            <TiChartAreaOutline className="mr-2" /> area
          </span>
          <span className="font-bold">
            {selected.continent.area.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between my-2 text-xs">
          <span className="flex">
            <GrLocation className="mr-2" /> position
          </span>
          <span className="font-bold">{`(${selected.continent.position})`}</span>
        </div>
        <div className="flex justify-between mt-10 mb-2 text-xs">
          <span className="flex">
            <FaUserTie className="mr-2" /> owner
          </span>
          <span className="font-bold">{selected.land.owner.email}</span>
        </div>
        {selected.land.capital && (
          <div className="flex justify-between my-2 text-xs">
            <span className="flex">
              <GrStatusGood className="mr-2" /> status
            </span>
            {selected.land.capital.operating ? (
              <span className="font-bold text-green-600">open</span>
            ) : (
              <span className="font-bold text-red-600">closed</span>
            )}
          </div>
        )}
        {underConstruction && (
          <div className="flex justify-between mb-2 text-xs">
            <span className="flex">
              <FaWrench className="mr-2" /> construction
            </span>
            <BsCircleFill className="text-green-500" />
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        {![ELandType.NONE, ELandType.DECORATION].includes(
          selected.land.type
        ) && (
          <Button
            label="Visit"
            icon={<AiOutlineAlignCenter />}
            linkProps={{
              to: `${pathname}/${selected.land.id}`,
              className: "mr-2",
            }}
          />
        )}
        {isOwner &&
          selected.land.type === ELandType.NONE &&
          !underConstruction && (
            <Button
              label="Build"
              icon={<FaWrench />}
              linkProps={{
                to: `${pathname}/${selected.land.id}/build`,
                className: "mr-2",
              }}
            />
          )}
        {selected.land.available &&
          !isOwner &&
          user!.coins >= selected.land.value &&
          !pendingContract && (
            <Button
              label="Buy"
              icon={<GiBuyCard />}
              linkProps={{
                to: `${pathname}/${selected.land.id}/buy`,
                className: "mr-2",
              }}
            />
          )}
        {(pendingContract || viewContract) && (
          <Button
            label="View"
            icon={
              <span className="flex">
                {pendingContract ? (
                  pendingContract.type === EContractType.LAND_BUY ? (
                    <GiBuyCard className="mr-1" />
                  ) : (
                    <MdOutlineSell className="mr-1" />
                  )
                ) : null}
                <ImFileText />
              </span>
            }
            linkProps={{
              to: `${pathname}/${selected.land.id}/contract/${
                pendingContract ? pendingContract.id : ""
              }`,
              className: "mr-2",
            }}
          />
        )}
        {isOwner && (
          <Button
            label="Sell"
            icon={<MdOutlineSell />}
            linkProps={{
              to: `${pathname}/${selected.land.id}/sell`,
              className: "mr-2",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Info;
