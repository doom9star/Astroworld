import { Route, useParams } from "react-router-dom";
import { CRouter } from "../../../../../../components/Route";
import Nav from "./Nav";
import TabChat from "./Tab/Chat";
import TabExplore from "./Tab/Explore";
import TabFiles from "./Tab/Files";
import TabLand from "./Tab/Land";
import TabMusic from "./Tab/Music";
import TabNews from "./Tab/News";
import TabVault from "./Tab/Vault";
import TabVideo from "./Tab/Video";
import { Fragment } from "react";

export default function DetailRouter() {
  const params = useParams();

  return (
    <Fragment>
      <div className="px-40">
        <Nav />
        <div className="overflow-y-scroll h-[70vh]">
          <CRouter
            redirect={`/home/world/${params.wid}/${params.lid}/visit/land`}
          >
            <Route path="land" element={<TabLand />} />
            <Route path="explore" element={<TabExplore />} />
            <Route path="news/*" element={<TabNews />} />
            <Route path="chat" element={<TabChat />} />
            <Route path="files" element={<TabFiles />} />
            <Route path="music" element={<TabMusic />} />
            <Route path="video" element={<TabVideo />} />
            <Route path="vault" element={<TabVault />} />
          </CRouter>
        </div>
      </div>
    </Fragment>
  );
}
