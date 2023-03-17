import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Alert from "./components/Alert";
import { PrivateRoute, PublicRoute } from "./components/Route";
import Spinner from "./components/Spinner";
import { cAxios } from "./misc/constants";
import { TResponse } from "./misc/types";
import Auth from "./pages/Auth";
import HomeRouter from "./pages/Home";
import Landing from "./pages/Landing";
import {
  setGlobalLoading,
  setUser,
  useGlobalState,
} from "./redux/slices/global";

function App() {
  const { loading } = useGlobalState();
  const dispatch = useDispatch();

  useEffect(() => {
    cAxios.get<TResponse>("/auth").then(({ data }) => {
      if (data.status === "SUCCESS") {
        dispatch(setUser(data.data));
      }
      dispatch(setGlobalLoading(false));
    });
  }, [dispatch]);

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <div>
      <BrowserRouter>
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="auth/*" element={<PublicRoute component={<Auth />} />} />
          <Route
            path="home/*"
            element={<PrivateRoute component={<HomeRouter />} />}
          />
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
