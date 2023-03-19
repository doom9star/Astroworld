import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Spinner from "../../../../components/Spinner";
import { cAxios } from "../../../../misc/constants";
import { TResponse } from "../../../../misc/types";
import { setWorld } from "../../../../redux/slices/world";
import Footer from "./Footer";
import Header from "./Header";
import Map from "./Map";

export type THeader = {
  cname: string;
  cpos: string;
  lpos: string;
  lcost: number;
};

function Detail() {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<THeader>({
    cname: "",
    cpos: "",
    lpos: "",
    lcost: 0,
  });

  const dispatch = useDispatch();
  const params = useParams();

  const toLand = useCallback((position: string) => {
    const land = document.getElementById(position);
    if (land) {
      land.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
      setHeader({
        cname: land.dataset.continent as string,
        cpos: position.substring(0, 3),
        lpos: position.substring(4),
        lcost: parseInt(land.dataset.lcost!),
      });
    }
  }, []);

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
      <Map setHeader={setHeader} toLand={toLand} />
      <Footer />
    </div>
  );
}

export default Detail;
