import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cAxios } from "../../misc/constants";
import { TResponse } from "../../misc/types";
import { setAlert, setUser } from "../../redux/slices/global";

type TInfo = {
  nameOrEmail: string;
  password: string;
};

function Register() {
  const [info, setInfo] = useState<TInfo>({
    nameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState<TInfo>({} as TInfo);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const onLogin = useCallback(() => {
    if (!loading) {
      const errors = {} as TInfo;
      if (info.nameOrEmail.trim().length === 0)
        errors.nameOrEmail = "Name/Email must not be empty!";
      if (info.password.trim().length < 4)
        errors.password = "Password length must be >= 4!";
      if (JSON.stringify(errors) === "{}") {
        setLoading(true);
        cAxios.post<TResponse>("/auth/login", info).then(({ data }) => {
          if (data.status === "SUCCESS") {
            dispatch(setUser(data.data));
            navigate("/home/world");
          } else {
            dispatch(setAlert({ state: "ERROR", message: data.message }));
          }
          setLoading(false);
        });
      }
      setErrors(errors);
    }
  }, [info, loading, dispatch, navigate]);

  return (
    <div className="flex flex-col w-[400px]">
      <input
        type={"text"}
        placeholder="Name/Email"
        className={`input ${classNames({
          "border-red-500": errors.nameOrEmail,
        })}`}
        autoFocus
        name="nameOrEmail"
        value={info.nameOrEmail}
        onChange={onChange}
      />
      {errors.nameOrEmail && (
        <span className="input-error">{errors.nameOrEmail}</span>
      )}
      <input
        type={"password"}
        placeholder="Password"
        className={`input ${classNames({
          "border-red-500": errors.password,
        })}`}
        name="password"
        value={info.password}
        onChange={onChange}
      />
      {errors.password && (
        <span className="input-error">{errors.password}</span>
      )}
      <div className="flex justify-between items-center my-4">
        <button
          type={"button"}
          className={`button ${classNames({ "opacity-60": loading })}`}
          onClick={onLogin}
        >
          {loading && <div className="spinner" />}
          Login
        </button>
        <span className="text-xs font-mono">
          New here? &nbsp;
          <span
            onClick={() => navigate("/auth/register")}
            className="underline font-bold cursor-pointer"
          >
            Register
          </span>
        </span>
      </div>
    </div>
  );
}

export default Register;
