import classNames from "classnames";
import { Fragment, useMemo } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { ImFileText } from "react-icons/im";
import { RiLandscapeLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import TimeAgo from "react-timeago";
import { setShowNotification, useGlobalState } from "../redux/slices/global";
import {
  EContractType,
  ENotificationHandler,
  ENotificationType,
  INotification,
} from "../redux/types";
import Button from "./Button";

type Props = {
  n: INotification;
};

function NotificationDetail({ n }: Props) {
  const dispatch = useDispatch();

  const contract = useMemo(() => {
    return n.handlers.find((h) => h.type === ENotificationHandler.CONTRACT);
  }, [n]);
  const land = useMemo(() => {
    return n.handlers.find((h) => h.type === ENotificationHandler.LAND);
  }, [n]);
  const user = useMemo(() => {
    return n.handlers.find((h) => h.type === ENotificationHandler.USER);
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
      <img src={n.thumbnail.url} alt={n.id} className="w-16 h-16" />
      <div className="px-2">
        <p className="leading-5 font-mono" style={{ fontSize: "0.6rem" }}>
          <span className="font-bold">{user?.info} </span>
          {n.type === ENotificationType.CONTRACT_PENDING ? (
            <span>
              has <span className="text-yellow-600 font-bold">extended </span>a
              contract to buy the land{" "}
            </span>
          ) : n.type === ENotificationType.CONTRACT_REJECTED ? (
            <span>
              has <span className="text-red-600 font-bold">rejected </span>your
              contract to buy the land{" "}
            </span>
          ) : n.type === ENotificationType.CONTRACT_ACCEPTED ? (
            <span>
              has <span className="text-green-600 font-bold">accepted </span>
              your contract to{" "}
              {contract?.info.split("|")[1] === EContractType.LAND_BUY
                ? "buy"
                : "sell"}{" "}
              the land{" "}
            </span>
          ) : (
            <span>
              has a{" "}
              <span className="text-blue-600 font-bold">
                counter negotiation
              </span>{" "}
              to a contract on the land{" "}
            </span>
          )}
          <span className="font-bold" style={{ fontSize: "0.6rem" }}>
            {land?.info}
          </span>
          !
        </p>
        <div className="flex my-2 items-center justify-between">
          <div className="flex">
            {contract && (
              <Button
                icon={<ImFileText />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/world/${n.info["world"]}/${land?.info}/contract/${
                    contract.info.split("|")[1]
                  }`,
                }}
                btnProps={{
                  onClick: () => dispatch(setShowNotification(false)),
                }}
              />
            )}
            {land && (
              <Button
                icon={<RiLandscapeLine />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/world/${n.info["world"]}`,
                  state: land.info,
                }}
                btnProps={{
                  onClick: () => dispatch(setShowNotification(false)),
                }}
              />
            )}
            {user && (
              <Button
                icon={<AiOutlineUser />}
                linkProps={{
                  className: "mr-2",
                  to: `/home/user/${user.info}`,
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
        <div className="my-4">
          {notifications.map((n) => (
            <NotificationDetail n={n} key={n.id} />
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Notification;
