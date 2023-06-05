import { useEffect, useState } from "react";
import { cAxios } from "../misc/constants";
import { ILand, TResponse } from "../redux/types";

export function useLand(id?: string) {
  const [land, setLand] = useState<ILand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      cAxios
        .get<TResponse>(`/land/${id}`)
        .then(({ data }) => {
          if (data.status === "S") {
            setLand(data.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return { land, loading };
}
