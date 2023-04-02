import classNames from "classnames";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { ImFileText } from "react-icons/im";
import { RiLandscapeLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import TimeAgo from "react-timeago";
import { cAxios } from "../misc/constants";
import { TResponse } from "../misc/types";
import { setNotification } from "../redux/slices/global";
import { ENotificationHandler, INotification } from "../redux/types";
import Button from "./Button";
import Spinner from "./Spinner";

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
        <p className="text-xs leading-5">
          <span className="font-bold" style={{ fontSize: "0.6rem" }}>
            {user?.info}{" "}
          </span>
          has extended a contract to buy the land{" "}
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
                  to: `/home/world/${n.info["world"]}/${land?.info}/contract/${contract.info}`,
                }}
                btnProps={{
                  onClick: () => dispatch(setNotification(false)),
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
                  onClick: () => dispatch(setNotification(false)),
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
                  onClick: () => dispatch(setNotification(false)),
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
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    cAxios
      .get<TResponse>("/notification")
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setNotifications(res.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Fragment>
      <div className="w-[100vw] h-[110vh] bg-awblack absolute z-40 opacity-20" />
      <div className="w-96 h-96 top-36 rounded-lg right-32 bg-gray-100 border absolute z-50 flex flex-col p-4">
        <span
          className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
          onClick={() => dispatch(setNotification(false))}
        >
          x
        </span>
        {loading ? (
          <Spinner size="small" />
        ) : (
          <div className="my-4">
            {notifications.map((n) => (
              <NotificationDetail n={n} key={n.id} />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Notification;
