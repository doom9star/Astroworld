import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Logo from "../../components/Logo";

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.split("/").filter((w) => !!w).length === 1) {
      navigate("/auth/login");
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center my-10">
      <Logo className="w-40" />
      <Routes>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default Auth;
