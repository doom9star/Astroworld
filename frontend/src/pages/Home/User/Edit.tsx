import classNames from "classnames";
import { Fragment, useCallback, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { useDispatch } from "react-redux";
import Back from "../../../components/Back";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import { cAxios } from "../../../misc/constants";
import { getExpiryDate } from "../../../misc/utils";
import {
  setAlert,
  setUser,
  useGlobalState,
} from "../../../redux/slices/global";
import { EGender, IFile, TResponse } from "../../../redux/types";
import { getDate } from "../../../misc/utils";

type AvatarPickerProps = {
  avatars: IFile[];
  selected: IFile;
  onChoose: (avatar: IFile) => void;
  onClose: () => void;
};

function AvatarPicker({
  avatars,
  onChoose,
  onClose,
  selected,
}: AvatarPickerProps) {
  return (
    <Fragment>
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-awblack opacity-10" />
      <div className="absolute z-50 top-[40%] left-1/2 flex flex-col w-[300px] h-[300px] border border-gray-200 p-2 bg-white shadow-md">
        <span
          className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
          onClick={onClose}
        >
          x
        </span>
        <div className="grid grid-cols-3">
          {avatars.map((avatar) => (
            <div
              className="flex flex-col items-center justify-center"
              key={avatar.cid}
            >
              <img
                src={avatar.url}
                alt={avatar.id}
                key={avatar.id}
                className={
                  "w-20 h-20 cursor-pointer " +
                  classNames({
                    "border border-gray-200 rounded-full":
                      selected.id === avatar.id,
                  })
                }
                onClick={() => onChoose(avatar)}
              />
              <span className="text-[0.5rem]">{avatar.cid.split(".")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

type TInfo = {
  name: string;
  avatar: IFile;
  birthDate: string;
  gender: EGender;
  description: string;
};

export default function Edit() {
  const { user } = useGlobalState();

  const [info, setInfo] = useState<TInfo>({
    name: user?.name || "",
    avatar: user?.avatar || ({} as IFile),
    birthDate: user?.birthDate ? getDate(user.birthDate, false) : "",
    gender: user?.gender || EGender.MALE,
    description: user?.description || "",
  });
  const [avatars, setAvatars] = useState<IFile[]>([]);
  const [errors] = useState<TInfo>({} as TInfo);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [displayAvatar, setDisplayAvatar] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    cAxios.get<TResponse>("/user/avatar").then(({ data }) => {
      if (data.status === "S") {
        setAvatars(data.data);
        setInfo((prev) => ({
          ...prev,
          avatar: prev.avatar || data.data[0],
        }));
        setLoading(false);
      }
    });
  }, []);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    },
    []
  );

  const onSave = useCallback(() => {
    setSaveLoading(true);
    cAxios
      .put<TResponse>("/user", info)
      .then(({ data }) => {
        if (data.status === "S") {
          dispatch(setUser({ ...user!, ...info }));
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: "Profile updated successfully!",
            })
          );
        }
      })
      .finally(() => {
        setSaveLoading(false);
      });
  }, [info, dispatch, user]);

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <>
      <div className="ml-80 inline-block">
        <Back />
      </div>
      <div className="flex flex-col w-[400px] mx-auto overflow-y-scroll">
        {displayAvatar && (
          <AvatarPicker
            avatars={avatars}
            onChoose={(avatar) => {
              setInfo((prev) => ({ ...prev, avatar }));
              setDisplayAvatar(false);
            }}
            onClose={() => setDisplayAvatar(false)}
            selected={info.avatar}
          />
        )}
        <img
          src={info.avatar?.url ? info.avatar.url : "/images/noImg.png"}
          alt="User-Avatar"
          className="w-24 h-24 self-center cursor-pointer rounded-full border border-gray-200 p-1 hover:opacity-70"
          onClick={() => setDisplayAvatar(true)}
        />
        <input
          type={"text"}
          placeholder="Name"
          className={`input ${classNames({
            "border-red-500": errors.name,
          })}`}
          autoFocus
          name="name"
          value={info.name}
          onChange={onChange}
        />
        {errors.name && <span className="input-error">{errors.name}</span>}
        <input
          type={"date"}
          max={getExpiryDate(-(365 * 10))}
          placeholder="Birth Date"
          className={`input ${classNames({
            "border-red-500": errors.birthDate,
          })}`}
          name="birthDate"
          value={info.birthDate}
          onChange={onChange}
        />
        {errors.birthDate && (
          <span className="input-error">{errors.birthDate}</span>
        )}
        <div className="flex justify-between items-center my-2">
          <span className="text-xs border border-gray-300 text-awblack py-2 px-8">
            Gender
          </span>
          <div className="flex items-center text-xs">
            <input
              type="radio"
              id="male"
              name="gender"
              value={EGender.MALE}
              className="mr-2"
              checked={info.gender === EGender.MALE}
              onChange={onChange}
            />
            <label htmlFor="male" className="mr-4">
              Male
            </label>
            <input
              type="radio"
              id="female"
              name="gender"
              value={EGender.FEMALE}
              className="mr-2"
              checked={info.gender === EGender.FEMALE}
              onChange={onChange}
            />
            <label htmlFor="female" className="mr-4">
              Female
            </label>
            <input
              type="radio"
              id="other"
              name="gender"
              value={EGender.OTHER}
              className="mr-2"
              checked={info.gender === EGender.OTHER}
              onChange={onChange}
            />
            <label htmlFor="other" className="mr-4">
              Other
            </label>
          </div>
        </div>
        <textarea
          placeholder="Something about yourself!"
          className={`input ${classNames({
            "border-red-500": errors.description,
          })}`}
          name="description"
          value={info.description}
          onChange={onChange}
          rows={6}
        ></textarea>
        <div className="flex justify-between items-center my-4">
          <Button
            label="Save"
            icon={<AiOutlineSave />}
            loading={saveLoading}
            btnProps={{ onClick: onSave }}
          />
        </div>
      </div>
    </>
  );
}
