import React, { Fragment, useCallback, useState } from "react";
import Logo from "./Logo";
import { setUser, useGlobalState } from "../redux/slices/global";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { cAxios } from "../misc/constants";
import { TResponse } from "../misc/types";
import { useDispatch } from "react-redux";

function Navbar() {
  const [loading, setLoading] = useState(false);

  const { user } = useGlobalState();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    setLoading(true);
    cAxios
      .delete<TResponse>("/auth/logout")
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(setUser(null));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <Fragment>
      <div className="p-5 flex justify-between items-center fixed bg-white w-[100vw]">
        <Logo className="w-28" />
        {user ? (
          <div className="flex items-center">
            <img
              src="/images/noImg.png"
              alt="User-Avatar"
              className="w-14 rounded-full border border-gray-200 p-1"
            />
            <div className="flex flex-col mr-4 ml-2">
              <span style={{ fontSize: "0.6rem" }}>
                {user.name || user.email}
              </span>
              <Link to={"/home/user/edit"}>
                <button
                  type={"button"}
                  className={`button py-1 mt-1 w-14 ${classNames({
                    "opacity-60": loading,
                  })}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  {loading && <div className="spinner" />}
                  Edit
                </button>
              </Link>
            </div>
            <button
              type={"button"}
              className={`button ${classNames({ "opacity-60": loading })}`}
              onClick={logout}
            >
              {loading && <div className="spinner" />}
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to={"/auth/login"}>
              <button
                type={"button"}
                className={`button mr-2 ${classNames({
                  "opacity-60": loading,
                })}`}
              >
                {loading && <div className="spinner" />}
                Login
              </button>
            </Link>
            <Link to={"/auth/register"}>
              <button
                type={"button"}
                className={`button ${classNames({ "opacity-60": loading })}`}
              >
                {loading && <div className="spinner" />}
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="pt-40" />
    </Fragment>
  );
}

export default Navbar;
