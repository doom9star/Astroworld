import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { TbWallpaper } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../../../components/Spinner";
import { useLand } from "../../../../../hooks/useLand";
import { cAxios } from "../../../../../misc/constants";
import { TResponse } from "../../../../../misc/types";
import { useGlobalState } from "../../../../../redux/slices/global";
import { setAlert } from "../../../../../redux/slices/global";

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
    expiry: "",
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
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: `PURCHASE CONTRACT has been successfully dispatched to ${land?.owner.email}!`,
            })
          );
          navigate(-1);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [info, user, land, dispatch, navigate]);

  useEffect(() => {
    if (!landLoading) {
      setInfo((prev) => ({
        ...prev,
        from: land!.owner.email,
        to: user!.email,
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
      <p className="flex items-center justify-center font-mono text-lg">
        <TbWallpaper className="mr-2 text-2xl" /> PURCHASE CONTRACT
      </p>
      <p className="text-center text-sm">{params.lid}</p>
      <div className="my-10 flex items-center justify-center">
        <div className="w-[400px] mr-10">
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
            />
          </div>
          <div className="flex items-center justify-between my-2">
            <label htmlFor="info" className="text-xs">
              Additional Information
            </label>
            <textarea
              placeholder="Additional Information"
              className={`input`}
              name="info"
              value={info.info}
              onChange={onChange}
              id="info"
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type={"button"}
            className={`button p-1 mr-4 w-14 ${classNames({
              "opacity-60": loading,
            })}`}
            style={{ fontSize: "0.6rem" }}
            onClick={onSign}
          >
            {loading && <div className="spinner" />}
            Sign
          </button>
          <button
            type={"button"}
            className={`button p-1 w-14 ${classNames({
              "opacity-60": false,
            })}`}
            style={{ fontSize: "0.6rem" }}
            onClick={() => navigate(-1)}
          >
            {false && <div className="spinner" />}
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buy;
