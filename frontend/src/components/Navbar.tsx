import { Fragment, useCallback, useState } from "react";
import { HiLogin, HiLogout } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdJoinFull, MdModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { cAxios } from "../misc/constants";
import { TResponse } from "../misc/types";
import {
  setNotification,
  setUser,
  useGlobalState,
} from "../redux/slices/global";
import Button from "./Button";
import Logo from "./Logo";

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
            <Button
              btnProps={{
                onClick: () => dispatch(setNotification(true)),
                className: "text-lg",
              }}
              linkProps={{
                className: "mr-4",
              }}
              icon={<IoMdNotificationsOutline />}
            />
            <img
              src="/images/noImg.png"
              alt="User-Avatar"
              className="w-14 rounded-full border border-gray-200 p-1"
            />
            <div className="flex flex-col mr-4 ml-2">
              <div
                className="flex items-center mb-1"
                style={{
                  fontSize: "0.6rem",
                }}
              >
                <span>{user.email}</span>
                <div className="ml-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  &nbsp;
                  <span>{user.coins}</span>
                </div>
              </div>
              <Button
                label="Edit"
                icon={<MdModeEditOutline />}
                linkProps={{
                  to: "/home/user/edit",
                }}
              />
            </div>
            <Button
              label="Logout"
              icon={<HiLogout />}
              loading={loading}
              btnProps={{
                onClick: logout,
              }}
            />
          </div>
        ) : (
          <div className="flex">
            <Button
              label="Login"
              icon={<HiLogin />}
              linkProps={{
                className: "mr-2",
                to: "/auth/login",
              }}
            />
            <Button
              label="Register"
              icon={<MdJoinFull />}
              linkProps={{
                to: "/auth/register",
              }}
            />
          </div>
        )}
      </div>
      <div className="pt-40" />
    </Fragment>
  );
}

export default Navbar;