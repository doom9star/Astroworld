import Map from "./Map";
import Header from "./Header";
import Footer from "./Footer";
import { useCallback, useEffect, useState } from "react";
import { cAxios } from "../../../../misc/constants";
import { useParams } from "react-router-dom";
import { TResponse } from "../../../../misc/types";
import Spinner from "../../../../components/Spinner";
import { setWorld } from "../../../../redux/slices/world";
import { useDispatch } from "react-redux";

export type THeader = {
  cname: string;
  cpos: string;
  lpos: string;
};

function Detail() {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<THeader>({
    cname: "",
    cpos: "",
    lpos: "",
  });

  const dispatch = useDispatch();
  const params = useParams();

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
      });
    }
  }, []);

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
