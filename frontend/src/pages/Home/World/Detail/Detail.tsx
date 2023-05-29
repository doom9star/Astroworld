import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import { cAxios } from "../../../../misc/constants";
import { setWorld, useWorldState } from "../../../../redux/slices/world";
import { IContinent, ILand, TResponse } from "../../../../redux/types";
import Header from "./Header";
import Map from "./Map";

export type THeader = {
  cname: string;
  cpos: string;
  lpos: string;
};

export type TSelected = {
  land: ILand;
  continent: IContinent;
} | null;

function Detail() {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<THeader>({
    cname: "",
    cpos: "",
    lpos: "",
  });
  const [selected, setSelected] = useState<TSelected>(null);

  const dispatch = useDispatch();
  const { world } = useWorldState();
  const params = useParams();
  const navigate = useNavigate();

  const toLand = useCallback(
    (position?: string, id?: string) => {
      if (!position && !id) return;
      const landBox = position
        ? document.querySelector(`[data-position="${position}"]`)
        : document.getElementById(id!);
      if (landBox) {
        landBox.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "smooth",
        });
        if (!position) position = (landBox as any).dataset.position as string;
        const cpos = position.substring(0, 3);
        const lpos = position.substring(4);
        const continent = world!.continents.find((c) => c.position === cpos)!;
        setHeader({
          cname: continent.name,
          cpos: position.substring(0, 3),
          lpos: position.substring(4),
        });
        if (selected || id) {
          const land = continent.lands.find((l) => l.position === lpos)!;
          setSelected({ continent, land });
        }
      }
    },
    [selected, world]
  );

  useEffect(() => {
    setLoading(true);
    cAxios
      .get<TResponse>("/world/" + params.wid)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(setWorld(res.data.data));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, params.wid]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  if (!world) {
    navigate("/home/world");
    return null;
  }

  return (
    <Fragment>
      <Header header={header} toLand={toLand} />
      <Map
        setHeader={setHeader}
        toLand={toLand}
        selected={selected}
        setSelected={setSelected}
      />
    </Fragment>
  );
}

export default Detail;
