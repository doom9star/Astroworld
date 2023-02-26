import { Route, Routes } from "react-router-dom";
import Edit from "./Edit";

export default function User() {
  return (
    <div className="flex flex-col items-center">
      <Routes>
        <Route path="edit" element={<Edit />} />
      </Routes>
    </div>
  );
}
