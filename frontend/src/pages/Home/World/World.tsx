import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { cAxios } from "../../../misc/constants";
import { setWorlds, useWorldState } from "../../../redux/slices/world";
import { TResponse } from "../../../redux/types";

function World() {
  const [loading, setLoading] = useState(true);

  const { worlds } = useWorldState();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    setLoading(true);
    cAxios
      .get<TResponse>("/world")
      .then(({ data }) => {
        if (data.status === "S") {
          dispatch(setWorlds(data.data));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <Spinner size="medium" />;
  }
  return (
    <div className="flex ml-40">
      {worlds.map((w) => (
        <Link to={`${pathname}/${w.id}`} key={w.id}>
          <div className="flex text-xs flex-col items-center capitalize font-mono font-bold">
            <img
              src={`/images/worlds/${w.name}.png`}
              alt={w.name}
              className="w-52"
            />
            <span
              style={{
                marginTop: "-0.5rem",
              }}
            >
              {w.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default World;
