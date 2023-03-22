import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../../../components/Spinner";
import { cAxios } from "../../../../../misc/constants";
import { TResponse } from "../../../../../misc/types";
import { ILand } from "../../../../../redux/types";
import TabLand from "./Tab/Land";
import TabNews from "./Tab/News";
import TabChat from "./Tab/Chat";

enum ETab {
  LAND,
  NEWS,
  CHAT,
}

function Land() {
  const [land, setLand] = useState<ILand | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ETab>(ETab.LAND);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    cAxios
      .get<TResponse>(`/land/${params.lid}`)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setLand(res.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.lid]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (!land) {
    navigate("/home/world");
    return null;
  }

  return (
    <div className="px-40">
      <div className="flex">
        <button
          className={
            "mr-8 text-xs" +
            classNames({
              " font-bold underline": tab === ETab.LAND,
            })
          }
          onClick={() => setTab(ETab.LAND)}
        >
          Land
        </button>
        <button
          className={
            "mr-8 text-xs" +
            classNames({
              " font-bold underline": tab === ETab.NEWS,
            })
          }
          onClick={() => setTab(ETab.NEWS)}
        >
          News
        </button>
        <button
          className={
            "mr-8 text-xs" +
            classNames({
              " font-bold underline": tab === ETab.CHAT,
            })
          }
          onClick={() => setTab(ETab.CHAT)}
        >
          Chat
        </button>
      </div>
      {tab === ETab.LAND ? (
        <TabLand land={land} />
      ) : tab === ETab.NEWS ? (
        <TabNews land={land} />
      ) : (
        <TabChat land={land} />
      )}
    </div>
  );
}

export default Land;
