import { Route } from "react-router-dom";
import { CRouter } from "../../components/Route";
import UserRouter from "./User";
import WorldRouter from "./World";

function HomeRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="user/*" element={<UserRouter />} />
      <Route path="world/*" element={<WorldRouter />} />
    </CRouter>
  );
}

export default HomeRouter;
