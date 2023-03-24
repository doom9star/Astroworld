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
import TabFiles from "./Tab/Files";
import TabMusic from "./Tab/Music";
import TabVideo from "./Tab/Video";
import TabExplore from "./Tab/Explore";
import Back from "../../../../../components/Back";
import { MdTravelExplore } from "react-icons/md";
import { BiNews, BiVideo } from "react-icons/bi";
import { BsChatDots, BsMusicNote } from "react-icons/bs";
import { TbFiles } from "react-icons/tb";
import { GrLocation } from "react-icons/gr";

enum ETab {
  LAND,
  EXPLORE,
  NEWS,
  CHAT,
  FILES,
  MUSIC,
  VIDEO,
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
        <Back />
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.LAND,
            })
          }
          onClick={() => setTab(ETab.LAND)}
        >
          <GrLocation className="mr-1" /> Land
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.EXPLORE,
            })
          }
          onClick={() => setTab(ETab.EXPLORE)}
        >
          <MdTravelExplore className="mr-1" /> Explore
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.NEWS,
            })
          }
          onClick={() => setTab(ETab.NEWS)}
        >
          <BiNews className="mr-1" /> News
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.CHAT,
            })
          }
          onClick={() => setTab(ETab.CHAT)}
        >
          <BsChatDots className="mr-1" /> Chat
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.FILES,
            })
          }
          onClick={() => setTab(ETab.FILES)}
        >
          <TbFiles className="mr-1" /> Files
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.MUSIC,
            })
          }
          onClick={() => setTab(ETab.MUSIC)}
        >
          <BsMusicNote className="mr-1" /> Music
        </button>
        <button
          className={
            "mr-10 text-xs flex items-center" +
            classNames({
              " font-bold underline": tab === ETab.VIDEO,
            })
          }
          onClick={() => setTab(ETab.VIDEO)}
        >
          <BiVideo className="mr-1" /> Video
        </button>
      </div>
      {tab === ETab.LAND ? (
        <TabLand land={land} />
      ) : tab === ETab.EXPLORE ? (
        <TabExplore land={land} />
      ) : tab === ETab.NEWS ? (
        <TabNews land={land} />
      ) : tab === ETab.CHAT ? (
        <TabChat land={land} />
      ) : tab === ETab.FILES ? (
        <TabFiles land={land} />
      ) : tab === ETab.MUSIC ? (
        <TabMusic land={land} />
      ) : (
        <TabVideo land={land} />
      )}
    </div>
  );
}

export default Land;
