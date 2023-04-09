import { BiCoin, BiCoinStack } from "react-icons/bi";
import { FaPlaceOfWorship, FaUserTie } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { ILand } from "../../../../../../redux/types";
import { AiOutlineCalendar } from "react-icons/ai";
import { getDate } from "../../../../../../misc/utils";

type Props = {
  land: ILand;
};

function TabLand({ land }: Props) {
  return (
    <div className="py-10 flex justify-around items-center">
      <div className="text-xs flex flex-col items-center">
        <span className="font-bold mb-4">
          {land.capital ? `CAPITAL` : land.id}
        </span>
        <div className="w-[30vw]">
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <FaPlaceOfWorship className="mr-2" /> continent
            </span>
            <span>{land.continent.name}</span>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <GrLocation className="mr-2" /> position
            </span>
            <span>{`(${land.continent.position} ${land.position})`}</span>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <AiOutlineCalendar className="mr-2" /> est
            </span>
            <span>{getDate(land.createdAt)}</span>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <FaUserTie className="mr-2" /> admin
            </span>
            <span>{land.owner.email}</span>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <BiCoinStack className="mr-2" />
              reserve
            </span>
            <span>{land.owner.coins.toLocaleString()}</span>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <BiCoin className="mr-2" />
              value
            </span>
            <span>{land.value.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div>
        {land.capital && (
          <img
            src={land.capital.thumbnail.url}
            alt="Capital"
            className="pt-8"
          />
        )}
      </div>
    </div>
  );
}

export default TabLand;
