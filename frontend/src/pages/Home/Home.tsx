import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { cAxios } from "../../misc/constants";
import { TResponse } from "../../misc/types";
import { setWorlds, useWorldState } from "../../redux/slices/world";

function Home() {
  const [loading, setLoading] = useState(true);

  const { worlds } = useWorldState();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    cAxios
      .get<TResponse>("/world")
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(setWorlds(res.data.data));
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
        <Link to={"/home/world/" + w.id} key={w.id}>
          <div className="flex text-xs flex-col items-center capitalize font-mono font-bold">
            <img src={w.thumbnail.url} alt={w.thumbnail.cid} className="w-52" />
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

export default Home;
