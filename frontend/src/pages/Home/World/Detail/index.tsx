import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import { cAxios } from "../../../../misc/constants";
import { TResponse } from "../../../../misc/types";
import { setWorld, useWorldState } from "../../../../redux/slices/world";
import { IContinent, ILand } from "../../../../redux/types";
import Footer from "./Footer";
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

  const toLand = useCallback(
    (position: string) => {
      const landBox = document.getElementById(position);
      if (landBox) {
        landBox.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "smooth",
        });
        const cpos = position.substring(0, 3);
        const lpos = position.substring(4);
        const continent = world!.continents.find((c) => c.position === cpos)!;
        setHeader({
          cname: continent.name,
          cpos: position.substring(0, 3),
          lpos: position.substring(4),
        });
        if (selected) {
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
      .get<TResponse>("/world/" + params.id)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          dispatch(setWorld(res.data.data));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, params.id]);

  if (loading) {
    return <Spinner size="medium" />;
  }

  return (
    <div>
      <Header header={header} toLand={toLand} />
      <Map
        setHeader={setHeader}
        toLand={toLand}
        selected={selected}
        setSelected={setSelected}
      />
      <Footer />
    </div>
  );
}

export default Detail;
