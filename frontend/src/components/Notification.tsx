import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { setNotification, useGlobalState } from "../redux/slices/global";

function Notification() {
  const { notification } = useGlobalState();
  const dispatch = useDispatch();

  if (!notification) {
    return null;
  }

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
      </div>
    </Fragment>
  );
}

export default Notification;
