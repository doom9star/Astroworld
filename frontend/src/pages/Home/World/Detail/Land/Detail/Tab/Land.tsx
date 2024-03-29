import { AiOutlineCalendar } from "react-icons/ai";
import { BiCoin, BiCoinStack } from "react-icons/bi";
import { FaPlaceOfWorship, FaUserTie } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../../../../../components/Spinner";
import { useLand } from "../../../../../../../hooks/useLand";
import { getDate } from "../../../../../../../misc/utils";
import { ELandType } from "../../../../../../../redux/types";

function TabLand() {
  const params = useParams();
  const navigate = useNavigate();
  const { land, loading } = useLand(params.lid);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (!land) {
    navigate("/home/world");
    return null;
  }
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
            <div className="ml-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              &nbsp;
              <span>
                {land.capital
                  ? land.capital.reserve.toLocaleString()
                  : land.owner.coins.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex justify-between m-4">
            <span className="flex items-center">
              <BiCoin className="mr-2" />
              value
            </span>
            <div className="ml-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              &nbsp;
              <span>{land.value.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        {land.type === ELandType.CAPITAL && (
          <img
            src={`/images/houses/3/blue.png`}
            alt="Capital"
            className="pt-8"
          />
        )}
      </div>
    </div>
  );
}

export default TabLand;
