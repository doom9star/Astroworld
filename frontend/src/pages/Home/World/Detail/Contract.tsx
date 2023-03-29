import { Fragment, useEffect, useMemo, useState } from "react";
import { TbWallpaper } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../../../../components/Back";
import Spinner from "../../../../components/Spinner";
import { cAxios } from "../../../../misc/constants";
import { TResponse } from "../../../../misc/types";
import {
  EContractStatus,
  EContractType,
  IContract,
} from "../../../../redux/types";

function Contract() {
  const params = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState<IContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cAxios
      .get<TResponse>("/contract/" + params.cid)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setContract(res.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  const contractInfo = useMemo(() => {
    if (contract) {
      const [entity, id] = contract.info.split("|");
      return { entity, id };
    }
  }, [contract]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (!contract) {
    navigate(-1);
    return null;
  }

  return (
    <Fragment>
      <div className="ml-60 float-left">
        <Back />
      </div>
      <div className="w-[500px] mx-auto border p-8">
        <p className="flex items-center justify-center mb-10 font-mono text-lg">
          <TbWallpaper className="mr-2 text-2xl" /> CONTRACT
        </p>
        <div className="flex justify-between text-xs my-4">
          <span>{contractInfo?.entity}</span>
          <span className="font-bold">{contractInfo?.id}</span>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>buyer</span>
          <span className="font-bold">{contract.from.email}</span>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>seller</span>
          <span className="font-bold">{contract.to.email}</span>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>coins</span>
          <div className="text-xs ml-3 flex items-center font-bold">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            &nbsp;
            <span>{contract.coins}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>due</span>
          <span className="font-bold">
            {contract.dueRate === 0 ? "immediately" : contract.dueRate}
          </span>
        </div>
        <div className="flex justify-between text-xs my-2">
          <span>status</span>
          <span
            className="font-bold text-white"
            style={{
              fontSize: "0.6rem",
            }}
          >
            {contract.status === EContractStatus.PENDING ? (
              <span className="py-1 px-2 rounded-lg bg-orange-600">
                PENDING
              </span>
            ) : contract.status === EContractStatus.ACCEPTED ? (
              <span className="py-1 px-2 rounded-lg bg-green-600">
                ACCEPTED
              </span>
            ) : (
              <span className="py-1 px-2 rounded-lg bg-red-600">REJECTED</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>expiry</span>
          <span className="font-bold">
            {new Date(contract.expiry).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-xs my-4">
          <span>type</span>
          <span className="font-bold">
            {contract.type === EContractType.PURCHASE ? "PURCHASE" : ""}
          </span>
        </div>
        <div
          className="flex justify-between around items-center mt-10"
          style={{
            fontSize: "0.7rem",
          }}
        >
          <div className="flex flex-col items-start">
            <span className="font-bold">
              {contract.from.email}
              &nbsp;{" (Buyer)"}
            </span>
            <span className="mb-2">{`(${new Date(
              contract.createdAt
            ).toLocaleDateString()})`}</span>
            <span className="flex items-center text-green-600 border border-green-600 rounded-lg py-1 px-2">
              <TiTick /> signed
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold">
              {contract.to.email}
              &nbsp;{" (Seller)"}
            </span>
            {contract.status === EContractStatus.ACCEPTED && (
              <>
                <span className="mb-2">{`(${new Date(
                  contract.updatedAt
                ).toLocaleDateString()})`}</span>
                <span className="flex items-center text-green-600 border border-green-600 rounded-lg py-1 px-2">
                  <TiTick /> signed
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Contract;
