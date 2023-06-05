import classNames from "classnames";
import { Fragment, useMemo } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiCoins } from "react-icons/gi";
import { ImFileText } from "react-icons/im";
import { RiLandscapeLine } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";
import { useDispatch } from "react-redux";
import TimeAgo from "react-timeago";
import { setShowNotification, useGlobalState } from "../redux/slices/global";
import { ENotificationType, INotification } from "../redux/types";
import Button from "./Button";

type Props = {
  n: INotification;
};

function NotificationDetail({ n }: Props) {
  const dispatch = useDispatch();

  const contract = useMemo(() => {
    return {
      id: n.handlers.find((h) => h.includes("contract"))?.split(":")[1],
    };
  }, [n]);
  const land = useMemo(() => {
    return {
      id: n.handlers.find((h) => h.includes("land"))?.split(":")[1],
    };
  }, [n]);
  const user = useMemo(() => {
    return {
      id: n.handlers.find((h) => h.includes("user"))?.split(":")[1],
    };
  }, [n]);

  const contractColor = useMemo(() => {
    switch (n.type) {
      case ENotificationType.CONTRACT_PENDING:
        return "text-orange-500";
      case ENotificationType.CONTRACT_ACCEPTED:
        return "text-green-500";
      case ENotificationType.CONTRACT_REJECTED:
        return "text-red-500";
      case ENotificationType.CONTRACT_NEGOTIATION:
        return "text-blue-500";
      default:
        return "";
    }
  }, [n]);

  return (
    <div
      className={
        "flex mb-4 hover:opacity-80 cursor-pointer" +
        classNames({
          " bg-gray-200": n.read,
        })
      }
    >
      {n.type === ENotificationType.NEW_CITIZEN ? (
        <GiCoins className="text-5xl text-yellow-500 mr-2" />
      ) : n.type === ENotificationType.BUILD_COMPLETION ? (
        <RiLandscapeLine className="text-5xl text-green-500 mr-2" />
      ) : (
        <TbFileInvoice
          className={
            `text-5xl mr-2 ` +
            classNames({
              [contractColor]: !!contractColor,
            })
          }
        />
      )}
      <div className="px-2">
        <p className="leading-5 font-mono" style={{ fontSize: "0.6rem" }}>
          {n.type === ENotificationType.NEW_CITIZEN ? (
            <span>
              Welcome to <span className="font-bold">ASTROWORLD</span>, the
              worlds have gifted you{" "}
              <span className="text-yellow-500 font-bold">
                {n.info.find((i) => i.includes("coins"))?.split(":")[1]}
              </span>{" "}
              coins to begin your journey!
            </span>
          ) : n.type === ENotificationType.BUILD_COMPLETION ? (
            <span>
              Construction of{" "}
              <span className="text-green-500 font-bold">shelter </span>on land-
              {land?.id} has completed successfully!
            </span>
          ) : (
            <>
              <span className="font-bold">{user?.id} </span>
              {n.type === ENotificationType.CONTRACT_PENDING ? (
                <span>
                  has{" "}
                  <span className="text-orange-500 font-bold">extended </span>a
                  contract to buy the land{" "}
                </span>
              ) : n.type === ENotificationType.CONTRACT_REJECTED ? (
                <span>
                  has <span className="text-red-500 font-bold">rejected </span>
                  the contract to buy the land{" "}
                </span>
              ) : n.type === ENotificationType.CONTRACT_ACCEPTED ? (
                <span>
                  has{" "}
                  <span className="text-green-500 font-bold">accepted </span>
                  the contract on the land{" "}
                </span>
              ) : (
                <span>
                  has a{" "}
                  <span className="text-blue-500 font-bold">
                    counter negotiation
                  </span>{" "}
                  to a contract on the land{" "}
                </span>
              )}
              <span className="font-bold" style={{ fontSize: "0.6rem" }}>
                {land?.id}
              </span>
              !
            </>
          )}
        </p>
        <div className="flex my-2 items-center justify-between">
          <div className="flex">
            {contract.id && (
              <Button
                icon={<ImFileText />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/world/${
                    n.info.find((i) => i.includes("world"))?.split(":")[1]
                  }/${land?.id}/contract/${contract?.id}`,
                }}
                btnProps={{
                  onClick: () => dispatch(setShowNotification(false)),
                }}
              />
            )}
            {land.id && (
              <Button
                icon={<RiLandscapeLine />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/world/${
                    n.info.find((i) => i.includes("world"))?.split(":")[1]
                  }`,
                  state: land.id,
                }}
                btnProps={{
                  onClick: () => dispatch(setShowNotification(false)),
                }}
              />
            )}
            {user.id && (
              <Button
                icon={<AiOutlineUser />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/user/${user.id}`,
                }}
                btnProps={{
                  onClick: () => dispatch(setShowNotification(false)),
                }}
              />
            )}
          </div>
          <span style={{ fontSize: "0.6rem", opacity: 0.5 }}>
            <TimeAgo date={n.createdAt} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Notification() {
  const dispatch = useDispatch();
  const { notifications } = useGlobalState();

  return (
    <Fragment>
      <div
        onClick={() => dispatch(setShowNotification(false))}
        className="w-[100vw] h-[110vh] bg-awblack absolute z-40 opacity-20"
      />
      <div className="w-96 h-96 top-36 rounded-lg right-32 bg-gray-100 border absolute z-50 flex flex-col p-4">
        <span
          className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
          onClick={() => dispatch(setShowNotification(false))}
        >
          x
        </span>
        <div className="my-4 overflow-y-scroll">
          {notifications.map((n) => (
            <NotificationDetail n={n} key={n.id} />
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Notification;
