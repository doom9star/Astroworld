import classNames from "classnames";
import React, { useCallback, useState } from "react";
import { MdJoinFull } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { cAxios } from "../../misc/constants";
import { setAlert, setUser } from "../../redux/slices/global";
import { TResponse } from "../../redux/types";

type TInfo = {
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const [info, setInfo] = useState<TInfo>({
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
      if (info.email.trim().length === 0)
        errors.email = "Email must not be empty!";
      if (info.password.trim().length < 4)
        errors.password = "Password length must be >= 4!";
      else if (info.password !== info.confirmPassword)
        errors.confirmPassword = "Password must match!";
      if (JSON.stringify(errors) === "{}") {
        setLoading(true);
        dispatch(setAlert({ state: "IDLE", message: "" }));
        cAxios.post<TResponse>("/auth/register", info).then(({ data }) => {
          if (data.status === "SUCCESS") {
            dispatch(setUser(data.data));
            navigate("/home/user/edit");
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
        autoFocus
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
        <Button
          label="Register"
          icon={<MdJoinFull />}
          btnProps={{
            onClick: onRegister,
          }}
          loading={loading}
        />
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
