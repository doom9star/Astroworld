import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cAxios } from "../../misc/constants";
import { TResponse } from "../../misc/types";
import { setAlert, setUser } from "../../redux/slices/global";

type TInfo = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const [info, setInfo] = useState<TInfo>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<TInfo>({} as TInfo);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const onRegister = useCallback(() => {
    if (!loading) {
      const errors = {} as TInfo;
      if (info.name.trim().length === 0)
        errors.name = "Name must not be empty!";
      if (info.email.trim().length === 0)
        errors.email = "Email must not be empty!";
      if (info.password.trim().length < 4)
        errors.password = "Password length must be >= 4!";
      else if (info.password !== info.confirmPassword)
        errors.confirmPassword = "Password must match!";
      if (JSON.stringify(errors) === "{}") {
        setLoading(true);
        cAxios.post<TResponse>("/auth/register", info).then(({ data }) => {
          if (data.status === "SUCCESS") {
            dispatch(setUser(data.data));
            navigate("/home");
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
        placeholder="Name"
        className={`input ${classNames({ "border-red-500": errors.name })}`}
        autoFocus
        name="name"
        value={info.name}
        onChange={onChange}
      />
      {errors.name && <span className="input-error">{errors.name}</span>}
      <input
        type={"email"}
        placeholder="Email"
        className={`input ${classNames({ "border-red-500": errors.email })}`}
        name="email"
        value={info.email}
        onChange={onChange}
      />
      {errors.email && <span className="input-error">{errors.email}</span>}
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
      <input
        type={"password"}
        placeholder="Confirm Password"
        className={`input ${classNames({
          "border-red-500": errors.confirmPassword,
        })}`}
        name="confirmPassword"
        value={info.confirmPassword}
        onChange={onChange}
      />
      {errors.confirmPassword && (
        <span className="input-error">{errors.confirmPassword}</span>
      )}
      <div className="flex justify-between items-center my-4">
        <button
          type={"button"}
          className={`button ${classNames({ "opacity-60": loading })}`}
          onClick={onRegister}
        >
          {loading && <div className="spinner" />}
          Register
        </button>
        <span className="text-xs font-mono">
          Already registered? &nbsp;
          <span
            onClick={() => navigate("/auth/login")}
            className="underline font-bold text-awblack cursor-pointer"
          >
            Login
          </span>
        </span>
      </div>
    </div>
  );
}

export default Register;
