import { useCallback, useEffect, useState } from "react";
import { THeader } from "./Detail";
import { useWorldState } from "../../../../redux/slices/world";
import { GrLocation } from "react-icons/gr";

type Props = {
  header: THeader;
  toLand: (position?: string, id?: string) => void;
};

function Header({ header, toLand }: Props) {
  const [scl, setSCL] = useState(false);
  const [s, setS] = useState({
    c: header.cpos,
    l: header.lpos,
  });

  const { world } = useWorldState();

  const onSChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setS((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  useEffect(() => {
    setS({ c: header.cpos, l: header.lpos });
  }, [header]);

  return (
    <div className="flex justify-center ml-[35%] items-center pb-4 text-gray-700 font-bold absolute top-12">
      <div className="flex items-center">
        <img
          src={`/images/worlds/${world?.name}.png`}
          alt={world?.name}
          className="w-24 rounded-full"
        />
        <div className="flex flex-col items-center">
          <span
            className="text-4xl font-mono"
            style={{
              WebkitTextStrokeWidth: "1.5px",
              WebkitTextFillColor: "transparent",
            }}
          >
            {world?.name}
          </span>
          <span className="text-xs">
            &nbsp;&nbsp;{`(${world?.area.toLocaleString()})`}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center ml-8">
        <GrLocation />
        <span className="text-lg font-mono">{header.cname.toUpperCase()}</span>
        <div className="text-sm flex">
          c:&nbsp;&nbsp;
          {scl ? (
            <input
              type={"text"}
              className="w-16 mr-4 p-1 text-xs outline-none border border-gray-300"
              placeholder="eg: 1 1"
              autoFocus
              name="c"
              value={s.c}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSCL(false);
                  toLand(`${s.c} ${s.l}`);
                  setS({ c: "", l: "" });
                } else if (e.key === "Escape") {
                  setSCL(false);
                  setS({ c: "", l: "" });
                }
              }}
              onChange={onSChange}
            />
          ) : (
            <span className="mr-4 cursor-pointer" onClick={() => setSCL(true)}>
              {`(${header.cpos})`}
            </span>
          )}
          l:&nbsp;&nbsp;
          {scl ? (
            <input
              type={"text"}
              className="w-16 mr-4 p-1 text-xs outline-none border border-gray-300"
              placeholder="eg: 1 1"
              name="l"
              value={s.l}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSCL(false);
                  toLand(`${s.c} ${s.l}`);
                  setS({ c: "", l: "" });
                } else if (e.key === "Escape") {
                  setSCL(false);
                  setS({ c: "", l: "" });
                }
              }}
              onChange={onSChange}
            />
          ) : (
            <span className="cursor-pointer" onClick={() => setSCL(true)}>
              {`(${header.lpos})`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
