import { useEffect, useState } from "react";
import { cAxios } from "../misc/constants";
import { TResponse } from "../misc/types";
import { ILand } from "../redux/types";

export function useLand(id?: string) {
  const [land, setLand] = useState<ILand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      cAxios
        .get<TResponse>(`/land/${id}`)
        .then((res) => {
          if (res.data.status === "SUCCESS") {
            setLand(res.data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return { land, loading };
}
