import React, { Fragment, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Alert from "./components/Alert";
import Landing from "./pages/Landing";
import { useDispatch } from "react-redux";
import {
  setGlobalLoading,
  setUser,
  useGlobalState,
} from "./redux/slices/global";
import Spinner from "./components/Spinner";
import { cAxios } from "./misc/constants";
import { TResponse } from "./misc/types";
import { PrivateRoute, PublicRoute } from "./components/Route";

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
    <Fragment>
      <Alert />
      <div className="my-10">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="auth/*"
              element={<PublicRoute component={<Auth />} />}
            />
            <Route
              path="home/*"
              element={<PrivateRoute component={<Home />} />}
            />
            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Fragment>
  );
}

export default App;
