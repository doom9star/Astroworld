import { Route, Routes } from "react-router-dom";
import Detail from "./Detail";

export default function World() {
  return (
    <div className="flex flex-col items-center">
      <Routes>
        <Route path=":id" element={<Detail />} />
      </Routes>
    </div>
  );
}
