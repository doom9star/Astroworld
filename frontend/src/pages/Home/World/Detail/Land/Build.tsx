import { BsHouse, BsHouseDoor } from "react-icons/bs";
import Button from "../../../../../components/Button";
import Back from "../../../../../components/Back";
import { BiBuildingHouse } from "react-icons/bi";
import { useState } from "react";
import classNames from "classnames";
import { MdOutlineDesignServices, MdOutlineWarehouse } from "react-icons/md";
import { AiOutlineClockCircle, AiOutlineInfo } from "react-icons/ai";
import { FaWrench } from "react-icons/fa";

type ShelterInfo = {
  type: 1 | 2;
  paint: "blue" | "green" | "orange" | "purple" | "red";
};

type TabInfo = {
  main: "shelter" | "warehouse";
  sub: "info" | "design";
};

function Build() {
  const [shelterInfo, setShelterInfo] = useState<ShelterInfo>({
    type: 1,
    paint: "blue",
  });
  const [tabInfo, setTabInfo] = useState<TabInfo>({
    main: "shelter",
    sub: "info",
  });
  return (
    <div className="flex flex-col px-40">
      <Back />
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-[20%] h-[100%] flex flex-col justify-center items-end">
          <Button
            label="Shelter"
            icon={<BsHouse />}
            btnProps={{
              className:
                "mb-2 w-28" +
                classNames({
                  " opacity-60": tabInfo.main === "shelter",
                }),
              onClick: () => setTabInfo({ ...tabInfo, main: "shelter" }),
            }}
          />
          <Button
            label="Warehouse"
            icon={<MdOutlineWarehouse />}
            btnProps={{
              className:
                "w-28" +
                classNames({
                  " opacity-60": tabInfo.main === "warehouse",
                }),
              onClick: () => setTabInfo({ ...tabInfo, main: "warehouse" }),
            }}
          />
        </div>
        {tabInfo.main === "shelter" ? (
          <div className="w-[80%] h-[100%] flex justify-center items-center">
            <img
              src={`/images/houses/${shelterInfo.type}/${shelterInfo.paint}.png`}
              alt="Shelter"
              className="w-80 m-10"
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
                          setShelterInfo({ ...shelterInfo, type: 1 }),
                        className:
                          "text-sm mr-2" +
                          classNames({ " border-2": shelterInfo.type === 1 }),
                      }}
                      icon={<BsHouseDoor />}
                    />
                    <Button
                      btnProps={{
                        onClick: () =>
                          setShelterInfo({ ...shelterInfo, type: 2 }),
                        className:
                          "text-sm" +
                          classNames({ " border-2": shelterInfo.type === 2 }),
                      }}
                      icon={<BiBuildingHouse />}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={
                        `bg-blue-500 w-7 h-7 rounded-full mr-2 cursor-pointer` +
                        classNames({
                          " border-4": shelterInfo.paint === "blue",
                        })
                      }
                      onClick={() =>
                        setShelterInfo({ ...shelterInfo, paint: "blue" })
                      }
                    />
                    <div
                      className={
                        `bg-green-500 w-7 h-7 rounded-full mr-2 cursor-pointer` +
                        classNames({
                          " border-4": shelterInfo.paint === "green",
                        })
                      }
                      onClick={() =>
                        setShelterInfo({ ...shelterInfo, paint: "green" })
                      }
                    />
                    <div
                      className={
                        `bg-orange-500 w-7 h-7 rounded-full mr-2 cursor-pointer` +
                        classNames({
                          " border-4": shelterInfo.paint === "orange",
                        })
                      }
                      onClick={() =>
                        setShelterInfo({ ...shelterInfo, paint: "orange" })
                      }
                    />
                    <div
                      className={
                        `bg-purple-500 w-7 h-7 rounded-full mr-2 cursor-pointer` +
                        classNames({
                          " border-4": shelterInfo.paint === "purple",
                        })
                      }
                      onClick={() =>
                        setShelterInfo({ ...shelterInfo, paint: "purple" })
                      }
                    />
                    <div
                      className={
                        `bg-red-500 w-7 h-7 rounded-full cursor-pointer` +
                        classNames({
                          " border-4": shelterInfo.paint === "red",
                        })
                      }
                      onClick={() =>
                        setShelterInfo({ ...shelterInfo, paint: "red" })
                      }
                    />
                  </div>
                </div>
              ) : tabInfo.sub === "info" ? (
                <div className="font-mono">
                  <div className="flex items-center justify-around">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-yellow-500" />
                      &nbsp;
                      <span>100</span>
                    </div>
                    <span className="flex items-center">
                      <AiOutlineClockCircle className="text-xl" /> &nbsp;10d
                    </span>
                  </div>
                  <Button
                    label="Build"
                    icon={<FaWrench />}
                    btnProps={{
                      className: "mx-auto mt-4",
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : tabInfo.main === "warehouse" ? (
          <div className="w-[80%] flex justify-center items-center">
            Warehouse
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Build;
