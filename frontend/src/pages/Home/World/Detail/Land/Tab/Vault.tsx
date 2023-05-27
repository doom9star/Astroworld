import { useEffect, useState } from "react";
import { GrTransaction } from "react-icons/gr";
import Spinner from "../../../../../../components/Spinner";
import { cAxios } from "../../../../../../misc/constants";
import { TResponse } from "../../../../../../misc/types";
import { ILand, ITransaction } from "../../../../../../redux/types";
import TimeAgo from "react-timeago";

type Props = {
  land: ILand;
};

function TabVault({ land }: Props) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cAxios
      .get<TResponse>("/transaction")
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setTransactions(res.data.data);
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
    <div className="flex flex-col items-center m-10">
      <span className="flex items-center font-mono mt-4 mb-6">
        <GrTransaction className="mr-2" /> <span>Transactions</span>
      </span>
      <table className="border w-full">
        <tr className="text-xs">
          <th className="p-2">ID</th>
          <th className="p-2">From</th>
          <th className="p-2">To</th>
          <th className="p-2">
            <div className="ml-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              &nbsp;&nbsp;
              <span>Coins</span>
            </div>
          </th>
          <th className="p-2">time</th>
        </tr>
        {transactions.map((t) => (
          <tr key={t.id} className="text-xs">
            <td className="border p-4 w-[32%] text-center">{t.id}</td>
            <td className="border p-4 w-[17%] text-center">
              {t.from ? t.from.email : "astroworld@gmail.com"}
            </td>
            <td className="border p-4 w-[17%] text-center">
              {t.to ? t.to.email : "astroworld@gmail.com"}
            </td>
            <td className="border p-4 w-[17%] text-center">{t.coins}</td>
            <td className="border p-4 w-[17%] text-center">
              <TimeAgo date={t.createdAt} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default TabVault;
