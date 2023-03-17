import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import User from "./User";
import World from "./World";

function HomeRouter() {
  return (
    <div>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="user/*" element={<User />} />
        <Route path="world/*" element={<World />} />
      </Routes>
    </div>
  );
}

export default HomeRouter;
