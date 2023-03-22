import { ILand } from "../../../../../../redux/types";

type Props = {
  land: ILand;
};

function TabLand({ land }: Props) {
  console.log(land);
  return (
    <div className="py-10 flex justify-around items-center">
      <div className="text-xs flex flex-col items-center">
        <span className="font-bold mb-4">
          {land.capital ? `CAPITAL` : land.id}
        </span>
        <div className="w-[30vw]">
          <div className="flex justify-between m-2">
            <span>continent</span>
            <span>{land.continent.name}</span>
          </div>
          <div className="flex justify-between m-2">
            <span>position</span>
            <span>{`(${land.continent.position}) (${land.position})`}</span>
          </div>
          <div className="flex justify-between m-2">
            <span>est</span>
            <span>{new Date(land.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between m-2">
            <span>admin</span>
            <span>{land.owner.email}</span>
          </div>
          <div className="flex justify-between m-2">
            <span>value</span>
            <span>{land.owner.coins}</span>
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
