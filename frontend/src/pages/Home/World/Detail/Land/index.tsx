import { Route } from "react-router-dom";
import { CRouter } from "../../../../../components/Route";
import Buy from "./Buy";
import ContractRouter from "./Contract";
import Land from "./Land";

function LandRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="" element={<Land />} />
      <Route path="buy" element={<Buy />} />
      <Route path="contract/*" element={<ContractRouter />} />
    </CRouter>
  );
}

export default LandRouter;
