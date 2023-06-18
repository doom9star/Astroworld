import { Route } from "react-router-dom";
import { CRouter } from "../../../../../components/Route";
import Buy from "./Buy";
import ContractRouter from "./Contract";
import DetailRouter from "./Detail";
import Sell from "./Sell";
import Build from "./Build";

function LandRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="buy" element={<Buy />} />
      <Route path="sell" element={<Sell />} />
      <Route path="build" element={<Build />} />
      <Route path="contract/*" element={<ContractRouter />} />
      <Route path="visit/*" element={<DetailRouter />} />
    </CRouter>
  );
}

export default LandRouter;
