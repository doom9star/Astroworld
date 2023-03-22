import { Route } from "react-router-dom";
import { CRouter } from "../../../components/Route";
import Edit from "./Edit";

export default function UserRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="edit" element={<Edit />} />
    </CRouter>
  );
}
