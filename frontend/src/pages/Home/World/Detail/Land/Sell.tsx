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
import { EContractType } from "../../../../../redux/types";

type TInfo = {
  coins: number;
  expiry: string;
  comment: string;
  negotiable: boolean;
};

function Buy() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { land, loading: landLoading } = useLand(params.lid);
  const { user } = useGlobalState();

  const [info, setInfo] = useState<TInfo>({
    coins: 0,
    expiry: getExpiryDate(10),
    comment: "",
    negotiable: false,
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
        to: user!.id,
        expiry: new Date(info.expiry),
        type: EContractType.LAND_SALE,
        wid: params.wid,
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(
            setAlert({
              state: "SUCCESS",
              message: `"LAND_SALE" contract has been successfully created!`,
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
          <TbWallpaper className="mr-2 text-2xl" /> SALE CONTRACT
        </p>
        <p className="text-center text-sm mb-10">{params.lid}</p>
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
        <div className="flex items-center justify-between my-2">
          <label htmlFor="comment" className="text-xs">
            Comment
          </label>
          <textarea
            placeholder="Additional Information..."
            className={`input`}
            name="comment"
            onChange={onChange}
            id="comment`"
            value={info.comment}
          ></textarea>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="negotiable"
            id="negotiable"
            className="mr-4"
            onChange={(e) => setInfo({ ...info, negotiable: e.target.checked })}
          />
          <label htmlFor="negotiable" style={{ fontSize: "0.7rem" }}>
            Negotiable
          </label>
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
