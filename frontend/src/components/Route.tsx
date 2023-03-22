import { ReactNode, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useGlobalState } from "../redux/slices/global";
import Navbar from "./Navbar";

type Props = {
  component: JSX.Element;
};

export function PrivateRoute({ component }: Props) {
  const { user } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  if (!user) return null;
  return (
    <>
      <Navbar />
      {component}
    </>
  );
}

export function PublicRoute({ component }: Props) {
  const { user } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home/world");
    }
  }, [user, navigate]);

  if (user) return null;
  return component;
}

type RouterProps = {
  children: ReactNode;
  redirect?: string;
};

export function CRouter({ children, redirect }: RouterProps) {
  return (
    <Routes>
      {children}
      <Route
        path="*"
        element={<Navigate to={redirect ? redirect : "/"} replace />}
      />
    </Routes>
  );
}
