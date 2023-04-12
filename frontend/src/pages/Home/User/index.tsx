import { Route } from "react-router-dom";
import { CRouter } from "../../../components/Route";
import Detail from "./Detail";
import Edit from "./Edit";

export default function UserRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="edit" element={<Edit />} />
      <Route path=":uid" element={<Detail />} />
    </CRouter>
  );
}
