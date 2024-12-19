import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { cAxios } from "../../../misc/constants";
import { IUser, TResponse } from "../../../redux/types";

function Detail() {
  const params = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(() => {
    setLoading(true);
    cAxios
      .get<TResponse>(`/user/user/${params.uid}`)
      .then(({ data }) => {
        if (data.status === "S") {
          setUser(data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.uid]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <Spinner size="large" />;
  }

  console.log(user);

  return <div></div>;
}

export default Detail;
