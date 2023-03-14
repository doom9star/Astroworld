import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "../redux/slices/global";

type Props = {
  className?: string;
};

function Logo(props: Props) {
  const { user } = useGlobalState();
  return (
    <Link to={user ? "/home" : "/"}>
      <div
        className={` ${classNames({
          [props.className || ""]: props.className,
        })}`}
      >
        <img src="/images/logo.png" alt="Astroworld-Logo" />
      </div>
    </Link>
  );
}

export default Logo;
