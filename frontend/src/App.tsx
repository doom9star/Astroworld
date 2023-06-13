import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import Alert from "./components/Alert";
import Notification from "./components/Notification";
import { CRouter, PrivateRoute, PublicRoute } from "./components/Route";
import Spinner from "./components/Spinner";
import { cAxios } from "./misc/constants";
import AuthRouter from "./pages/Auth";
import HomeRouter from "./pages/Home";
import Landing from "./pages/Landing";
import {
  setGlobalLoading,
  setUser,
  useGlobalState,
} from "./redux/slices/global";
import { TResponse } from "./redux/types";
import Gift from "./components/Gift";

function App() {
  const { loading, showNotification, showGift } = useGlobalState();
  const dispatch = useDispatch();

  useEffect(() => {
    cAxios.get<TResponse>("/auth").then(({ data }) => {
      if (data.status === "S") {
        dispatch(setUser(data.data));
      }
      dispatch(setGlobalLoading(false));
    });
  }, [dispatch]);

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <BrowserRouter>
      <Alert />
      {showNotification && <Notification />}
      {showGift && <Gift />}
      <CRouter>
        <Route path="/" element={<Landing />} />
        <Route
          path="auth/*"
          element={<PublicRoute component={<AuthRouter />} />}
        />
        <Route
          path="home/*"
          element={<PrivateRoute component={<HomeRouter />} />}
        />
      </CRouter>
    </BrowserRouter>
  );
}

export default App;
