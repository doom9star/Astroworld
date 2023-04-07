import React from "react";
import classNames from "classnames";
import { FaCannabis } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";

import { setAlert, useGlobalState } from "../redux/slices/global";
import { useDispatch } from "react-redux";

function Alert() {
  const { alert } = useGlobalState();
  const dispatch = useDispatch();
  if (alert.state === "IDLE") {
    return null;
  }
  return (
    <div
      className={`flex fixed top-0 w-full items-center justify-between z-50 p-3 ${classNames(
        {
          "border border-awred bg-red-200": alert.state === "ERROR",
          "border border-awgreen bg-green-200": alert.state === "SUCCESS",
        }
      )}`}
    >
      <div className="flex">
        <FaCannabis
          className={alert.state === "ERROR" ? "text-awred" : "text-awgreen"}
        />
        <span className="text-xs ml-4 font-mono">{alert.message}</span>
      </div>
      <VscChromeClose
        className={`cursor-pointer ${
          alert.state === "ERROR" ? "text-awred" : "text-awgreen"
        }`}
        onClick={() => dispatch(setAlert({ state: "IDLE", message: "" }))}
      />
    </div>
  );
}

export default Alert;
