import { Route } from "react-router-dom";
import { CRouter } from "../../../components/Route";
import DetailRouter from "./Detail";
import World from "./World";

function WorldRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="" element={<World />} />
      <Route path=":wid/*" element={<DetailRouter />} />
    </CRouter>
  );
}

export default WorldRouter;
