import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { HiLogin } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { cAxios } from "../../misc/constants";
import { setAlert, setUser } from "../../redux/slices/global";
import { TResponse } from "../../redux/types";

type TInfo = {
  email: string;
  password: string;
};

function Register() {
  const [info, setInfo] = useState<TInfo>({
    email: "",
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
      if (info.email.trim().length === 0)
        errors.email = "Name/Email must not be empty!";
      if (info.password.trim().length < 4)
        errors.password = "Password length must be >= 4!";
      if (JSON.stringify(errors) === "{}") {
        setLoading(true);
        dispatch(setAlert({ state: "IDLE", message: "" }));
        cAxios.post<TResponse>("/auth/login", info).then(({ data }) => {
          if (data.status === "S") {
            dispatch(setUser(data.data));
            navigate("/home/world");
          } else {
            dispatch(setAlert({ state: "ERROR", message: data.data }));
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
        type={"email"}
        placeholder="Name/Email"
        className={`input ${classNames({
          "border-red-500": errors.email,
        })}`}
        autoFocus
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
      <div className="flex justify-between items-center my-4">
        <Button
          label="Login"
          icon={<HiLogin />}
          btnProps={{
            onClick: onLogin,
          }}
          loading={loading}
        />
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
