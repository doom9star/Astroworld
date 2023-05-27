import classNames from "classnames";
import { useCallback, useState } from "react";
import { AiOutlineClockCircle, AiOutlineInfo } from "react-icons/ai";
import { BiBuildingHouse } from "react-icons/bi";
import { BsHouseDoor } from "react-icons/bs";
import { CgSandClock } from "react-icons/cg";
import { FaWrench } from "react-icons/fa";
import { MdOutlineDesignServices, MdOutlineHouse } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../../../../../components/Back";
import Button from "../../../../../components/Button";
import Spinner from "../../../../../components/Spinner";
import { useLand } from "../../../../../hooks/useLand";
import { getExpiryDate } from "../../../../../misc/utils";
import { EBuildable } from "../../../../../redux/types";
import { cAxios } from "../../../../../misc/constants";
import { TResponse } from "../../../../../misc/types";
import { useDispatch } from "react-redux";
import { setAlert } from "../../../../../redux/slices/global";
import { useWorldState } from "../../../../../redux/slices/world";

const paint = ["blue", "green", "orange", "purple", "red", "yellow"] as const;
const arcToPaint = {
  1: paint.filter((p) => p !== "yellow"),
  2: paint.filter((p) => p !== "yellow"),
  4: paint.filter((p) => ["blue", "yellow"].includes(p)),
};

type ShelterInfo = {
  type: 1 | 2 | 4;
  paint: (typeof paint)[number];
};

type TabInfo = {
  main: keyof typeof EBuildable;
  sub: "info" | "design";
};

function Build() {
  const [shelterInfo, setShelterInfo] = useState<ShelterInfo>({
    type: 1,
    paint: "blue",
  });
  const [tabInfo, setTabInfo] = useState<TabInfo>({
    main: "SHELTER",
    sub: "info",
  });
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { land, loading: landLoading } = useLand(params.lid);
  const { world } = useWorldState();

  const buildProperty = useCallback(() => {
    setLoading(true);
    cAxios
      .post<TResponse>(`/land/${land!.id}/build/${EBuildable[tabInfo.main]}`, {
        value: land!.value + shelterInfo.type * 100,
        paint: shelterInfo.paint,
        built: new Date(getExpiryDate(shelterInfo.type * 20)),
        type: shelterInfo.type,
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: `${tabInfo.main} construction has begun in the land-${
                land!.id
              }!`,
            })
          );
          navigate(`/home/world/${world?.id}`, {
            state: land?.id,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [land, world, tabInfo, shelterInfo, dispatch, navigate]);

  if (landLoading) {
    return <Spinner size="medium" />;
  }

  if (!land) {
    navigate("/home/world");
    return null;
  }

  return (
    <div className="flex flex-col px-40">
      <Back />
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-[20%] h-[100%] flex flex-col justify-center items-end">
          {Object.keys(EBuildable).map((b) => (
            <Button
              key={b}
              label={b[0] + b.toLowerCase().slice(1)}
              btnProps={{
                style: {
                  fontSize: "0.6rem",
                },
                className:
                  "mb-2 w-28" +
                  classNames({
                    " opacity-60": tabInfo.main === b,
                  }),
                onClick: () => setTabInfo({ ...tabInfo, main: b as any }),
              }}
            />
          ))}
        </div>
        {tabInfo.main === "SHELTER" ? (
          <div className="w-[80%] h-[100%] flex justify-center items-center">
            <img
              src={`/images/houses/${shelterInfo.type}/${shelterInfo.paint}.png`}
              alt="Shelter"
              className="w-80"
            />
            <div className="w-1/4">
              <div className="flex justify-around mb-20">
                <Button
                  label="Info"
                  icon={<AiOutlineInfo />}
                  btnProps={{
                    onClick: () => setTabInfo({ ...tabInfo, sub: "info" }),
                    className:
                      "border-0" +
                      classNames({
                        " border-b-2 border-black": tabInfo.sub === "info",
                      }),
                  }}
                />
                <Button
                  label="Design"
                  icon={<MdOutlineDesignServices />}
                  btnProps={{
                    onClick: () => setTabInfo({ ...tabInfo, sub: "design" }),
                    className:
                      "border-0" +
                      classNames({
                        " border-b-2 border-black": tabInfo.sub === "design",
                      }),
                  }}
                />
              </div>
              {tabInfo.sub === "design" ? (
                <div className="flex flex-col items-center">
                  <div className="flex mb-4">
                    <Button
                      btnProps={{
                        onClick: () =>
                          setShelterInfo({ type: 1, paint: arcToPaint[1][0] }),
                        className:
                          "text-sm mr-2" +
                          classNames({ " border-2": shelterInfo.type === 1 }),
                      }}
                      icon={<MdOutlineHouse />}
                    />
                    <Button
                      btnProps={{
                        onClick: () =>
                          setShelterInfo({ type: 2, paint: arcToPaint[2][0] }),
                        className:
                          "text-sm mr-2" +
                          classNames({ " border-2": shelterInfo.type === 2 }),
                      }}
                      icon={<BsHouseDoor />}
                    />
                    <Button
                      btnProps={{
                        onClick: () =>
                          setShelterInfo({ type: 4, paint: arcToPaint[4][0] }),
                        className:
                          "text-sm" +
                          classNames({ " border-2": shelterInfo.type === 4 }),
                      }}
                      icon={<BiBuildingHouse />}
                    />
                  </div>
                  <div className="flex items-center">
                    {arcToPaint[shelterInfo.type].map((p) => (
                      <div
                        key={p}
                        style={{
                          backgroundColor: p,
                          filter: "brightness(1.5)",
                          border:
                            shelterInfo.paint === p
                              ? "2px dashed white"
                              : "none",
                        }}
                        className={`w-6 h-6 rounded-full mr-2 cursor-pointer`}
                        onClick={() =>
                          setShelterInfo({ ...shelterInfo, paint: p as any })
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : tabInfo.sub === "info" ? (
                <div className="font-mono">
                  <div className="flex items-center justify-around">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-yellow-500" />
                      &nbsp;
                      <span>{land.value + shelterInfo.type * 100}</span>
                    </div>
                    <span className="flex items-center whitespace-nowrap">
                      <AiOutlineClockCircle className="text-xl" /> &nbsp;
                      {shelterInfo.type * 20}d
                    </span>
                  </div>
                  <span className="flex justify-center items-center whitespace-nowrap my-4">
                    <CgSandClock className="text-xl" /> &nbsp;
                    {new Date(
                      getExpiryDate(shelterInfo.type * 20)
                    ).toLocaleDateString("en-GB", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <Button
                    loading={loading}
                    label="Build"
                    icon={<FaWrench />}
                    btnProps={{
                      className: "mx-auto",
                      onClick: buildProperty,
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : tabInfo.main === "WAREHOUSE" ? (
          <div className="w-[80%] flex justify-center items-center">
            Warehouse
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Build;
