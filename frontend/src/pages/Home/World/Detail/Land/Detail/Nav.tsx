import classNames from "classnames";
import { useMemo } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { BiNews, BiVideo } from "react-icons/bi";
import { BsChatDots, BsMusicNote } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { MdTravelExplore } from "react-icons/md";
import { TbFiles } from "react-icons/tb";
import { Link, useLocation, useParams } from "react-router-dom";
import Back from "../../../../../../components/Back";

enum ETab {
  LAND = "land",
  EXPLORE = "explore",
  NEWS = "news",
  CHAT = "chat",
  FILES = "files",
  MUSIC = "music",
  VIDEO = "video",
  VAULT = "vault",
}

function Nav() {
  const params = useParams();
  const { pathname } = useLocation();

  const tab = useMemo(() => {
    const tab = pathname.split("/").slice(-1)[0] as ETab;
    return tab;
  }, [pathname]);

  return (
    <div className="flex">
      <Back to={{ url: `/home/world/${params.wid}`, state: params.lid }} />
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.LAND}`}
        className={
          "mx-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.LAND,
          })
        }
      >
        <GrLocation className="mr-1" /> Land
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.EXPLORE}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.EXPLORE,
          })
        }
      >
        <MdTravelExplore className="mr-1" /> Explore
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.NEWS}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": pathname.includes("news"),
          })
        }
      >
        <BiNews className="mr-1" /> News
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.CHAT}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.CHAT,
          })
        }
      >
        <BsChatDots className="mr-1" /> Chat
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.FILES}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.FILES,
          })
        }
      >
        <TbFiles className="mr-1" /> Files
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.MUSIC}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.MUSIC,
          })
        }
      >
        <BsMusicNote className="mr-1" /> Music
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.VIDEO}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.VIDEO,
          })
        }
      >
        <BiVideo className="mr-1" /> Video
      </Link>
      <Link
        to={`/home/world/${params.wid}/${params.lid}/visit/${ETab.VAULT}`}
        className={
          "mr-10 text-xs flex items-center" +
          classNames({
            " font-bold underline": tab === ETab.VAULT,
          })
        }
      >
        <AiOutlineLock className="mr-1" /> Vault
      </Link>
    </div>
  );
}

export default Nav;
