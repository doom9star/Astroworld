import { Route } from "react-router-dom";
import { CRouter } from "../../../../components/Route";
import Detail from "./Detail";
import Land from "./Land";

function DetailRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="" element={<Detail />} />
      <Route path=":lid" element={<Land />} />
    </CRouter>
  );
}

export default DetailRouter;
