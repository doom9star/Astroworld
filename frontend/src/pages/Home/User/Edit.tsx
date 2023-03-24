import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import Back from "../../../components/Back";
import Spinner from "../../../components/Spinner";
import { cAxios } from "../../../misc/constants";
import { TResponse } from "../../../misc/types";
import { IFile } from "../../../redux/types";

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
    <div className="absolute z-20 top-1/2 left-1/2 flex flex-col w-[300px] h-[300px] border border-gray-200 p-2 bg-white shadow-md">
      <span
        className="border border-gray-200 text-gray-500 self-end cursor-pointer px-2 py-1 text-xs rounded-full"
        onClick={onClose}
      >
        x
      </span>
      <div className="grid grid-cols-3">
        {avatars.map((avatar) => (
          <div className="flex flex-col items-center justify-center">
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
            <span className="text-[0.5rem]">{avatar.cid}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type TInfo = {
  name: string;
  avatar: IFile;
  birthDate: string;
  description: string;
};

export default function Edit() {
  const [info, setInfo] = useState<TInfo>({
    name: "",
    avatar: {} as IFile,
    birthDate: new Date().toISOString(),
    description: "",
  });
  const [avatars, setAvatars] = useState<IFile[]>([]);
  const [errors] = useState<TInfo>({} as TInfo);
  const [loading, setLoading] = useState(false);
  const [displayAvatar, setDisplayAvatar] = useState(false);

  useEffect(() => {
    setLoading(true);
    cAxios.get<TResponse>("/user/avatar").then((res) => {
      if (res.data.status === "SUCCESS") {
        setAvatars(res.data.data);
        setInfo((prev) => ({ ...prev, avatar: res.data.data[0] }));
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
          <div className="absolute top-0 left-0 w-[100vw] h-[100vh] z-10 bg-awblack opacity-10" />
        )}
        <div className="self-center relative">
          <img
            src={info.avatar?.url ? info.avatar.url : "/images/noImg.png"}
            alt="User-Avatar"
            className="w-24 h-24 cursor-pointer rounded-full border border-gray-200 p-1 hover:opacity-70"
            onClick={() => setDisplayAvatar(true)}
          />
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
        </div>
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
          <button
            type={"button"}
            className={`button ${classNames({ "opacity-60": loading })}`}
          >
            {loading && <div className="spinner" />}
            Save
          </button>
        </div>
      </div>
    </>
  );
}
