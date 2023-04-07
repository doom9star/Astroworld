import { useCallback, useEffect, useState } from "react";
import { FaSignature } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { TbWallpaper } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/Button";
import Spinner from "../../../../../components/Spinner";
import { useLand } from "../../../../../hooks/useLand";
import { cAxios } from "../../../../../misc/constants";
import { TResponse } from "../../../../../misc/types";
import { getExpiryDate } from "../../../../../misc/utils";
import { setAlert, useGlobalState } from "../../../../../redux/slices/global";

type TInfo = {
  from: string;
  to: string;
  coins: number;
  expiry: string;
  info: string;
};

function Buy() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { land, loading: landLoading } = useLand(params.lid);
  const { user } = useGlobalState();

  const [info, setInfo] = useState<TInfo>({
    from: "",
    to: "",
    coins: 0,
    expiry: getExpiryDate(2),
    info: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    },
    []
  );

  const onSign = useCallback(() => {
    setLoading(true);
    cAxios
      .post<TResponse>(`/land/${land?.id}/contract`, {
        ...info,
        from: user!.id,
        to: land!.owner.id,
        expiry: new Date(info.expiry),
        wid: params.wid,
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: `"LAND PURCHASE" contract has been successfully dispatched to ${land?.owner.email}!`,
            })
          );
          navigate(-1);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [info, user, land, params, dispatch, navigate]);

  useEffect(() => {
    if (!landLoading) {
      setInfo((prev) => ({
        ...prev,
        from: user!.email,
        to: land!.owner.email,
        coins: land!.value,
      }));
    }
  }, [landLoading, land, user]);

  if (landLoading) {
    return <Spinner size="medium" />;
  }

  if (!land) {
    navigate("/home/world");
    return null;
  }

  return (
    <div>
      <div className="w-[500px] mx-auto border p-8">
        <p className="flex items-center justify-center font-mono text-lg">
          <TbWallpaper className="mr-2 text-2xl" /> PURCHASE CONTRACT
        </p>
        <p className="text-center text-sm mb-10">{params.lid}</p>
        <div className="flex items-center justify-between my-2">
          <label htmlFor="buyer" className="text-xs">
            Buyer
          </label>
          <input
            type={"text"}
            placeholder="Buyer"
            className={`input opacity-80`}
            id="buyer"
            value={info.from}
            readOnly
          />
        </div>
        <div className="flex items-center justify-between my-2">
          <label htmlFor="seller" className="text-xs">
            Seller
          </label>
          <input
            type={"text"}
            placeholder="Seller"
            className={`input opacity-80`}
            id="seller"
            value={info.to}
            readOnly
          />
        </div>
        <div className="flex items-center justify-between my-2">
          <label htmlFor="coins" className="text-xs">
            Coins
          </label>
          <input
            type={"number"}
            placeholder="Coins"
            className={`input`}
            name="coins"
            value={info.coins}
            onChange={onChange}
            id="coins"
          />
        </div>
        <div className="flex items-center justify-between my-2">
          <label htmlFor="expiry" className="text-xs">
            Expiry
          </label>
          <input
            type={"date"}
            placeholder="Expiry"
            className={`input`}
            name="expiry"
            onChange={onChange}
            id="expiry"
            min={getExpiryDate(2)}
            value={info.expiry}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            label="Sign"
            icon={<FaSignature />}
            loading={loading}
            linkProps={{
              className: "mr-2",
            }}
            btnProps={{
              onClick: onSign,
            }}
          />
          <Button
            label="Cancel"
            icon={<RxCross1 />}
            btnProps={{
              onClick: () => navigate(-1),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Buy;
