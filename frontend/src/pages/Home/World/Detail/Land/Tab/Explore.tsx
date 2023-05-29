import { useEffect, useState } from "react";
import { IContract, ILand, TResponse } from "../../../../../../redux/types";
import { cAxios } from "../../../../../../misc/constants";
import Spinner from "../../../../../../components/Spinner";
import { MdSell } from "react-icons/md";
import ReactTimeago from "react-timeago";
import { Link, useParams } from "react-router-dom";

type Props = {
  land: ILand;
};

function TabExplore({ land }: Props) {
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    cAxios
      .get<TResponse>("/contract/sale")
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setContracts(res.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner size="medium" />;
  }

  return (
    <div className="m-10">
      <div className="flex flex-col">
        <span className="flex items-center justify-center text-sm font-mono mt-4 mb-6">
          <MdSell className="mr-2" /> Sale
        </span>
        <div>
          {contracts.map((c) => (
            <Link
              key={c.id}
              className="flex border justify-between mb-2 p-4 text-xs hover:opacity-80"
              to={`/home/world/${params.wid}/${c.info.split("|")[1]}/contract/${
                c.id
              }`}
            >
              <span>{c.id}</span>
              <span>{c.to.email}</span>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                &nbsp;&nbsp;
                <span>{c.coins}</span>
              </div>
              <ReactTimeago date={c.createdAt} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TabExplore;
