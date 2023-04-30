import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { FaSignature } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TbWallpaper } from "react-icons/tb";
import { TiBusinessCard, TiTick } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../../../../../../components/Back";
import Button from "../../../../../../components/Button";
import Info from "../../../../../../components/Info";
import Spinner from "../../../../../../components/Spinner";
import { cAxios } from "../../../../../../misc/constants";
import { TResponse } from "../../../../../../misc/types";
import { getDate } from "../../../../../../misc/utils";
import { setUser, useGlobalState } from "../../../../../../redux/slices/global";
import {
  EContractStatus,
  EContractType,
  IContract,
} from "../../../../../../redux/types";
import classNames from "classnames";

type NegotiateInfo = {
  coins: number;
  comment: string;
};

function Detail() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useGlobalState();

  const [contract, setContract] = useState<IContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [negotiating, setNegotiating] = useState(false);
  const [signLoading, setSignLoading] = useState({
    accepted: false,
    rejected: false,
  });
  const [info, setInfo] = useState<NegotiateInfo>({
    coins: 0,
    comment: "",
  });

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

  const signContract = useCallback(
    (sign: EContractStatus) => {
      setSignLoading((prev) => ({
        ...prev,
        [sign === EContractStatus.ACCEPTED ? "accepted" : "rejected"]: true,
      }));
      cAxios
        .post<TResponse>(`/contract/${contract?.id}/sign`, {
          sign,
          wid: params.wid,
        })
        .then((res) => {
          if (res.data.status === "SUCCESS") {
            setContract(res.data.data);
            if (sign === EContractStatus.ACCEPTED) {
              const coins = contract!.coins.slice(-1)[0];
              if (contract?.type === EContractType.LAND_BUY) {
                dispatch(setUser({ ...user!, coins: user!.coins + coins }));
              } else {
                dispatch(setUser({ ...user!, coins: user!.coins - coins }));
              }
            }
          }
        })
        .finally(() => {
          setSignLoading((prev) => ({
            ...prev,
            [sign === EContractStatus.ACCEPTED ? "accepted" : "rejected"]:
              false,
          }));
        });
    },
    [contract, params, dispatch, user]
  );

  const negotiateContract = useCallback(() => {
    setNegotiating(true);
    cAxios
      .post<TResponse>(`/contract/${params.cid}/negotiate`, {
        ...info,
        wid: params.wid,
        to:
          user?.id === contract?.from.id ? contract?.to.id : contract?.from.id,
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setContract((prev) => ({ ...prev!, negotiation: res.data.data }));
          setInfo({ coins: 0, comment: "" });
        }
      })
      .finally(() => {
        setNegotiating(false);
      });
  }, [info, params, contract, user]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (!contract) {
    navigate(-1);
    return null;
  }

  const Footer = () => {
    return (
      <div className="flex">
        <Button
          label="Accept"
          icon={<FaSignature />}
          loading={signLoading.accepted}
          btnProps={{
            className: "text-green-600 border border-green-600 mt-2 mr-2",
            onClick: () => signContract(EContractStatus.ACCEPTED),
          }}
        />
        {contract.type !== EContractType.LAND_SALE && (
          <Button
            label="Reject"
            icon={<RxCross2 />}
            loading={signLoading.rejected}
            btnProps={{
              className: "text-red-600 border border-red-600 mt-2",
              onClick: () => signContract(EContractStatus.REJECTED),
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ overflow: "scroll", maxHeight: "80vh" }}
    >
      {!contract.negotiable && (
        <Info body={contract.negotiation[0].comment} top={40} left={80} />
      )}
      <div className="flex relative">
        <div className="absolute -left-32">
          <Back />
        </div>
        <div className="w-[500px] border p-8">
          <p className="flex items-center justify-center mb-10 font-mono text-lg">
            <TbWallpaper className="mr-2 text-2xl" /> CONTRACT
          </p>
          <div className="flex justify-between text-xs my-4">
            <span>{contractInfo?.entity}</span>
            <span className="font-bold">{contractInfo?.id}</span>
          </div>
          <div className="flex justify-between text-xs my-4">
            <span>buyer</span>
            <span className="font-bold">
              {contract.from
                ? contract.from.email
                : contract.to.id !== user?.id
                ? user?.email
                : "-"}
            </span>
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
              <span>{contract.coins.slice(-1)[0]}</span>
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
                <span className="py-1 px-2 rounded-lg bg-red-600">
                  REJECTED
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-xs my-4">
            <span>expiry</span>
            <span className="font-bold">{getDate(contract.expiry)}</span>
          </div>
          <div className="flex justify-between text-xs my-4">
            <span>type</span>
            <span className="font-bold">
              {contract.type === EContractType.LAND_BUY ? "PURCHASE" : "SALE"}
            </span>
          </div>
          <div
            className="flex justify-between around items-center mt-10"
            style={{
              fontSize: "0.7rem",
            }}
          >
            <div className="flex flex-col items-start">
              {contract.negotiation[0].uid === contract.from.id ? (
                <>
                  <span className="font-bold whitespace-nowrap">
                    {contract.from.email}
                    &nbsp;{" (Buyer)"}
                  </span>
                  <span className="mb-2">{`(${getDate(
                    contract.type === EContractType.LAND_SALE
                      ? contract.updatedAt
                      : contract.createdAt
                  )})`}</span>
                  <span
                    className="flex items-center font-bold text-white py-1 px-2 rounded-lg bg-green-600"
                    style={{
                      fontSize: "0.6rem",
                    }}
                  >
                    <TiTick /> <span>SIGNED</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold whitespace-nowrap">
                    {user?.email}
                    &nbsp;{" (Buyer)"}
                  </span>
                  <Footer />
                </>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold whitespace-nowrap">
                {contract.to.email}
                &nbsp;{" (Seller)"}
              </span>
              {contract.negotiation[0].uid === contract.to.id ||
              contract.status === EContractStatus.ACCEPTED ? (
                <>
                  <span className="mb-2">{`(${getDate(
                    contract.type === EContractType.LAND_SALE
                      ? contract.createdAt
                      : contract.updatedAt
                  )})`}</span>
                  <span
                    className="flex items-center font-bold text-white py-1 px-2 rounded-lg bg-green-600"
                    style={{
                      fontSize: "0.6rem",
                    }}
                  >
                    <TiTick /> <span>SIGNED</span>
                  </span>
                </>
              ) : contract.status === EContractStatus.REJECTED ? (
                <>
                  <span className="mb-2">{`(${getDate(
                    contract.updatedAt
                  )})`}</span>
                  <span
                    className="flex items-center font-bold text-white py-1 px-2 rounded-lg bg-red-600"
                    style={{
                      fontSize: "0.6rem",
                    }}
                  >
                    <RxCross2 /> &nbsp;<span>REJECTED</span>
                  </span>
                </>
              ) : contract.to.id === user?.id ? (
                <Footer />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="m-10">
        <p className="flex justify-center items-center font-mono mb-4">
          <TiBusinessCard className="mr-2" /> Negotiation
        </p>
        <div className="flex w-full items-start justify-center">
          <div className="flex flex-col mb-6 mr-10 w-1/2">
            <div className="flex items-center justify-between">
              <label htmlFor="coins" className="text-xs mx-2">
                Coins
              </label>
              <input
                type={"number"}
                placeholder="Coins"
                className={`input`}
                name="coins"
                value={info.coins}
                onChange={(e) =>
                  setInfo({ ...info, coins: parseInt(e.target.value) })
                }
                id="coins"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="comment" className="text-xs mx-2">
                Comment
              </label>
              <textarea
                placeholder="Additional Information..."
                className={`input`}
                name="comment"
                onChange={(e) => setInfo({ ...info, comment: e.target.value })}
                id="comment`"
                value={info.comment}
              ></textarea>
            </div>
            <Button
              label="Negotiate"
              icon={<TiBusinessCard />}
              btnProps={{
                className: "mt-4 float-right",
                style: {
                  opacity: contract.negotiation[0].uid === user?.id ? 0.5 : 1,
                },
                disabled: contract.negotiation[0].uid === user?.id,
                onClick: negotiateContract,
              }}
              loading={negotiating}
            />
            {contract.negotiation[0].uid === user?.id && (
              <span className="text-right" style={{ fontSize: "0.6rem" }}>
                * You can negotiate after a counter *
              </span>
            )}
          </div>
          <div className="w-1/2">
            {contract.negotiation.map((n, idx) => (
              <div
                key={n.coins}
                className={
                  "flex flex-col border p-4 font-mono my-2 w-3/4" +
                  classNames({
                    " opacity-50": idx > 0,
                    " ml-auto": n.uid === user?.id,
                  })
                }
              >
                <span
                  style={{ fontSize: "0.6rem" }}
                  className={
                    "my-2 text-gray-500 " +
                    classNames({
                      "text-left": n.uid !== user?.id,
                      "text-right": n.uid === user?.id,
                    })
                  }
                >
                  {n.uid}
                </span>
                <div
                  className={
                    "flex items-center my-2 " +
                    classNames({
                      "flex-row": n.uid !== user?.id,
                      "flex-row-reverse": n.uid === user?.id,
                    })
                  }
                >
                  <div
                    className={
                      "flex items-center " +
                      classNames({
                        "flex-row": n.uid !== user?.id,
                        "flex-row-reverse": n.uid === user?.id,
                      })
                    }
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500" />
                    &nbsp;
                    <span className="font-bold">{n.coins}</span>
                  </div>
                  <div className="mx-10" />
                  <span className="text-xs">{n.comment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
