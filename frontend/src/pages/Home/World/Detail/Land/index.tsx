import { Route } from "react-router-dom";
import { CRouter } from "../../../../../components/Route";
import Buy from "./Buy";
import Land from "./Land";

function LandRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="" element={<Land />} />
      <Route path="buy" element={<Buy />} />
    </CRouter>
  );
}

export default LandRouter;
