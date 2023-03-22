import { useEffect } from "react";
import { Route, useLocation, useNavigate } from "react-router-dom";

import Logo from "../../components/Logo";
import { CRouter } from "../../components/Route";
import Login from "./Login";
import Register from "./Register";

function AuthRouter() {
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
      <CRouter>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </CRouter>
    </div>
  );
}

export default AuthRouter;
