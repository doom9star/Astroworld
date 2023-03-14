import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      navigate("/home");
    }
  }, [user, navigate]);

  if (user) return null;
  return component;
}
