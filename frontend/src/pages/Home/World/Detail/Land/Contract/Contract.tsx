import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Back from "../../../../../../components/Back";
import Spinner from "../../../../../../components/Spinner";
import { cAxios } from "../../../../../../misc/constants";
import { TResponse } from "../../../../../../misc/types";
import {
  EContractType,
  IContract,
  EContractStatus,
} from "../../../../../../redux/types";

function Contract() {
  const [contracts, setContracts] = useState<IContract[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    cAxios
      .get<TResponse>(`/land/${params.lid}/contract/${EContractType.PURCHASE}`)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setContracts(res.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.lid]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  return (
    <div className="px-40 flex flex-col">
      <div className="flex items-center">
        <Back />
        <span className="ml-10">
          <span className="text-xs">{params.lid}</span>{" "}
          <span className="font-mono text-lg">&nbsp;| CONTRACTS</span>
        </span>
      </div>
      <div className="py-10 px-20">
        {contracts.map((c) => (
          <Link to={`${pathname}${c.id}`}>
            <div
              key={c.id}
              className="flex justify-between items-center bg-gray-100 py-4 px-8 text-xs rounded-lg mb-2"
            >
              <span>{c.id}</span>
              <span>{c.from.email}</span>
              <div className="ml-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                &nbsp;
                <span>{c.coins}</span>
              </div>
              <span
                className="font-bold text-white"
                style={{
                  fontSize: "0.6rem",
                }}
              >
                {c.status === EContractStatus.PENDING ? (
                  <span className="py-1 px-2 rounded-lg bg-orange-600">
                    PENDING
                  </span>
                ) : c.status === EContractStatus.ACCEPTED ? (
                  <span className="py-1 px-2 rounded-lg bg-green-600">
                    ACCEPTED
                  </span>
                ) : (
                  <span className="py-1 px-2 rounded-lg bg-red-600">
                    REJECTED
                  </span>
                )}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Contract;
