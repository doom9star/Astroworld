import { Route } from "react-router-dom";
import { CRouter } from "../../../../../../components/Route";
import Contract from "./Contract";
import Detail from "./Detail";

function ContractRouter() {
  return (
    <CRouter redirect="/home/world">
      <Route path="" element={<Contract />} />
      <Route path=":cid" element={<Detail />} />
    </CRouter>
  );
}

export default ContractRouter;
