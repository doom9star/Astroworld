import classNames from "classnames";
import { Link } from "react-router-dom";
import { useGlobalState } from "../redux/slices/global";

type Props = {
  className?: string;
};

function Logo(props: Props) {
  const { user } = useGlobalState();
  return (
    <Link to={user ? "/home/world" : "/"}>
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
