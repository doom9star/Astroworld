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
        className={`button flex items-center` + btnProps?.className}
        style={
          label && icon
            ? { fontSize: "0.6rem", ...btnProps?.style }
            : { ...btnProps?.style }
        }
      >
        {loading && (
          <div
            className={`spinner ${!label ? "w-3 h-3 top-2" : ""} ${
              !btnProps?.className?.includes("text-")
                ? "border-black"
                : "border" +
                  btnProps.className.match(/text-[a-z]+-\d+/)?.[0].substring(4)
            }`}
          />
        )}
        <span
          className={
            "flex items-center " +
            classNames({
              "opacity-30": !!loading,
            })
          }
        >
          {icon}
          {label && <span className="ml-2">{label}</span>}
        </span>
      </button>
    </Link>
  );
}

export default Button;
