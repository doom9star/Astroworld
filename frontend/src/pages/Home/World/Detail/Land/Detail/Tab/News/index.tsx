import { BiNews } from "react-icons/bi";
import { CRouter } from "../../../../../../../../components/Route";
import { Route, useParams } from "react-router-dom";
import New from "./New";
import Feed from "./Feed";

function TabNews() {
  const params = useParams();
  return (
    <div className="m-10">
      <span className="flex items-center justify-center text-sm font-mono mt-4 mb-6">
        <BiNews className="mr-2" /> News
      </span>
      <CRouter
        redirect={`/home/world/${params.wid}/${params.lid}/visit/news/feed`}
      >
        <Route path="feed" element={<Feed />} />
        <Route path="new" element={<New />} />
      </CRouter>
    </div>
  );
}

export default TabNews;
