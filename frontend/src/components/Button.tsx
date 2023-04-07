import classNames from "classnames";
import { ReactNode } from "react";
import { Link, LinkProps, To } from "react-router-dom";

type Props = {
  label?: string;
  icon?: ReactNode;
  loading?: boolean;
  btnProps?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  linkProps?: Omit<LinkProps, "to"> & { to?: To };
};

function Button({ label, icon, loading, btnProps, linkProps }: Props) {
  return (
    <Link to="#" {...linkProps}>
      <button
        {...btnProps}
        type={"button"}
        className={
          `button flex items-center ${classNames({
            "opacity-60": !!loading,
          })} ` + btnProps?.className
        }
        style={label && icon ? { fontSize: "0.6rem" } : {}}
      >
        {loading && <div className="spinner" />}
        {icon}
        {label && <span className="ml-2">{label}</span>}
      </button>
    </Link>
  );
}

export default Button;
