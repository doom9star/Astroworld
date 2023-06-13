import { Fragment, useCallback, useState } from "react";
import { GiTwoCoins } from "react-icons/gi";
import { useDispatch } from "react-redux";
import Timeago from "react-timeago";
import {
  setGifts,
  setShowGift,
  setUser,
  useGlobalState,
} from "../redux/slices/global";
import { ETransactionType, ITransaction, TResponse } from "../redux/types";
import Button from "./Button";
import { TiTickOutline } from "react-icons/ti";
import { cAxios } from "../misc/constants";

type Props = {
  g: ITransaction;
};

function GiftDetail({ g }: Props) {
  const [collecting, setCollecting] = useState(false);

  const dispatch = useDispatch();
  const { user, gifts } = useGlobalState();

  const collectGift = useCallback(() => {
    setCollecting(true);
    cAxios
      .put<TResponse>(`/transaction/${g.id}/complete`)
      .then(({ data }) => {
        if (data.status === "S") {
          const _gifts = gifts.map((_g) => {
            if (_g.id === g.id) {
              return { ...g, completed: true };
            }
            return g;
          });
          dispatch(setGifts({ gifts: _gifts, replace: true }));
          dispatch(setUser({ ...user!, coins: user!.coins + 10 }));
        }
      })
      .finally(() => {
        setCollecting(false);
      });
  }, [user, dispatch, g, gifts]);

  return (
    <div className={"flex mb-4 cursor-pointer"}>
      <GiTwoCoins className="text-5xl text-yellow-500 mr-2" />

      <div className="px-2 w-full">
        {g.type === ETransactionType.LOGIN_GIFT ? (
          <p className="leading-5 font-mono" style={{ fontSize: "0.6rem" }}>
            Your daily login gift, <span className="text-yellow-500">10</span>{" "}
            coins.
          </p>
        ) : null}
        <div className="flex my-2 items-center justify-between">
          <div className="flex">
            {g.completed ? (
              <Button
                icon={<TiTickOutline />}
                btnProps={{
                  disabled: true,
                }}
              />
            ) : (
              <Button
                icon={<GiTwoCoins className="text-yellow-500" />}
                btnProps={{
                  onClick: collectGift,
                }}
                loading={collecting}
              />
            )}
          </div>
          <span style={{ fontSize: "0.6rem", opacity: 0.5 }}>
            <Timeago date={g.createdAt} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Gift() {
  const dispatch = useDispatch();
  const { gifts } = useGlobalState();

  return (
    <Fragment>
      <div
        onClick={() => dispatch(setShowGift(false))}
        className="w-[100vw] h-[110vh] bg-awblack absolute z-40 opacity-20"
      />
      <div className="w-96 h-96 top-36 rounded-lg right-48 bg-gray-100 border absolute z-50 flex flex-col p-4">
        <span
          className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
          onClick={() => dispatch(setShowGift(false))}
        >
          x
        </span>
        <div className="my-4 overflow-y-scroll">
          {gifts.map((g) => (
            <GiftDetail g={g} key={g.id} />
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Gift;
