import classNames from "classnames";
import React from "react";

type Props = {
  className?: string;
};

function Logo(props: Props) {
  return (
    <div
      className={` ${classNames({ [props.className || ""]: props.className })}`}
    >
      <img src="/images/logo.png" alt="Astroworld-Logo" />
    </div>
  );
}

export default Logo;
