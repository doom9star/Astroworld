import classNames from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  label?: string;
  link?: string;
  icon?: ReactNode;
  loading?: boolean;
  contStyles?: string;
  btnProps?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
};

function Button({ link, label, icon, loading, contStyles, btnProps }: Props) {
  return (
    <Link to={link ? link : "#"} className={contStyles}>
      <button
        {...btnProps}
        type={"button"}
        className={
          `button flex items-center ${classNames({
            "opacity-60": !!loading,
          })}` + btnProps?.className
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
