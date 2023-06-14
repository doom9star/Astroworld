import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineInfo } from "react-icons/ai";
import { BiBuildingHouse } from "react-icons/bi";
import { BsHouseDoor } from "react-icons/bs";
import { CgSandClock } from "react-icons/cg";
import { FaAsterisk, FaWrench } from "react-icons/fa";
import { MdOutlineDesignServices, MdOutlineHouse } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Back from "../../../../../components/Back";
import Button from "../../../../../components/Button";
import Spinner from "../../../../../components/Spinner";
import { useLand } from "../../../../../hooks/useLand";
import { getExpiryDate } from "../../../../../misc/utils";
import { EBuildable, TResponse } from "../../../../../redux/types";
import { cAxios } from "../../../../../misc/constants";
import { useDispatch } from "react-redux";
import {
  setAlert,
  setUser,
  useGlobalState,
} from "../../../../../redux/slices/global";
import { useWorldState } from "../../../../../redux/slices/world";

const paint = ["blue", "green", "orange", "purple", "red", "yellow"] as const;
const arcPaint = {
  1: paint.filter((p) => p !== "yellow"),
  2: paint.filter((p) => p !== "yellow"),
  4: paint.filter((p) => ["blue", "yellow"].includes(p)),
  5: paint.filter((p) => !["green", "yellow"].includes(p)),
};

type ArcInfo = {
  type: 1 | 2 | 4 | 5;
  paint: (typeof paint)[number];
};

type TabInfo = {
  main: keyof typeof EBuildable;
  sub: "info" | "design";
};

function Build() {
  const [arcInfo, setArcInfo] = useState<ArcInfo>({
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
  const { user } = useGlobalState();

  const buildProperty = useCallback(() => {
    const value = land!.value * (arcInfo.type * 5);
    setLoading(true);
    cAxios
      .post<TResponse>(`/land/${land!.id}/build/${EBuildable[tabInfo.main]}`, {
        value,
        paint: arcInfo.paint,
        built: new Date(getExpiryDate(arcInfo.type * 20)),
        type: arcInfo.type,
      })
      .then(({ data }) => {
        if (data.status === "S") {
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: `${tabInfo.main} construction has begun in the land-${
                land!.id
              }!`,
            })
          );
          dispatch(setUser({ ...user!, coins: user!.coins - value }));
          navigate(`/home/world/${world?.id}`, {
            state: land?.id,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [land, world, tabInfo, arcInfo, dispatch, navigate, user]);

  useEffect(() => {
    if (tabInfo.main === "SHELTER") {
      setArcInfo({ type: 1, paint: "blue" });
    } else {
      setArcInfo({ type: 5, paint: "blue" });
    }
  }, [tabInfo.main]);

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
          {Object.keys(EBuildable)
            .slice(Object.keys(EBuildable).length / 2)
            .map((b) => (
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
        <div className="w-[80%] h-[80%] flex justify-center items-center">
          <img
            src={`/images/houses/${arcInfo.type}/${arcInfo.paint}.png`}
            alt={"Shelter"}
            className="w-80 h-[100%]"
          />
          <div className="w-1/4 h-[100%]">
            <div className="flex justify-around mb-10">
              <Button
                label="Info"
                icon={<AiOutlineInfo />}
                btnProps={{
                  onClick: () => setTabInfo({ ...tabInfo, sub: "info" }),
                  className: classNames({
                    " border-none": tabInfo.sub !== "info",
                  }),
                }}
              />
              <Button
                label="Design"
                icon={<MdOutlineDesignServices />}
                btnProps={{
                  onClick: () => setTabInfo({ ...tabInfo, sub: "design" }),
                  className: classNames({
                    " border-none": tabInfo.sub !== "design",
                  }),
                }}
              />
            </div>
            {tabInfo.sub === "design" ? (
              <div className="flex flex-col items-center">
                {tabInfo.main === "SHELTER" && (
                  <div className="flex mb-4">
                    <Button
                      btnProps={{
                        onClick: () =>
                          setArcInfo({ type: 1, paint: arcPaint[1][0] }),
                        className:
                          "text-sm mr-2" +
                          classNames({ " border-2": arcInfo.type === 1 }),
                      }}
                      icon={<MdOutlineHouse />}
                    />
                    <Button
                      btnProps={{
                        onClick: () =>
                          setArcInfo({ type: 2, paint: arcPaint[2][0] }),
                        className:
                          "text-sm mr-2" +
                          classNames({ " border-2": arcInfo.type === 2 }),
                      }}
                      icon={<BsHouseDoor />}
                    />
                    <Button
                      btnProps={{
                        onClick: () =>
                          setArcInfo({ type: 4, paint: arcPaint[4][0] }),
                        className:
                          "text-sm" +
                          classNames({ " border-2": arcInfo.type === 4 }),
                      }}
                      icon={<BiBuildingHouse />}
                    />
                  </div>
                )}
                <div className="flex items-center">
                  {arcPaint[arcInfo.type].map((p) => (
                    <div
                      key={p}
                      style={{
                        backgroundColor: p,
                        filter: "brightness(1.5)",
                        border:
                          arcInfo.paint === p ? "2px dashed white" : "none",
                      }}
                      className={`w-6 h-6 rounded-full mr-2 cursor-pointer`}
                      onClick={() =>
                        setArcInfo({ ...arcInfo, paint: p as any })
                      }
                    />
                  ))}
                </div>
              </div>
            ) : tabInfo.sub === "info" ? (
              <div className="font-mono flex flex-col">
                <div className="flex items-center justify-around">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500" />
                    &nbsp;
                    <span>
                      {(land.value * (arcInfo.type * 5)).toLocaleString()}
                    </span>
                  </div>
                  <span className="flex items-center whitespace-nowrap">
                    <AiOutlineClockCircle className="text-xl" /> &nbsp;
                    {arcInfo.type * 20}d
                  </span>
                </div>
                <span className="flex justify-center items-center whitespace-nowrap my-4 text-xs">
                  <CgSandClock className="text-xl" /> &nbsp;
                  {new Date(
                    getExpiryDate(arcInfo.type * 20)
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
                  linkProps={{
                    className: "mx-auto",
                  }}
                  btnProps={{
                    style: {
                      opacity:
                        user!.coins < land.value * (arcInfo.type * 5) ? 0.5 : 1,
                    },
                    onClick: buildProperty,
                    disabled: user!.coins < land.value * (arcInfo.type * 5),
                  }}
                />
                {user!.coins < land.value * (arcInfo.type * 5) && (
                  <div
                    className="flex items-center justify-center mt-1"
                    style={{ fontSize: "0.5rem" }}
                  >
                    <FaAsterisk className="text-red-500 mr-2" />
                    <span>You don't have enough coins!</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Build;
