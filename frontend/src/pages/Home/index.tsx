import React from "react";
import { Route, Routes } from "react-router-dom";
import User from "./User";

function Home() {
  return (
    <div>
      <Routes>
        <Route path="user/*" element={<User />} />
      </Routes>
    </div>
  );
}

export default Home;
