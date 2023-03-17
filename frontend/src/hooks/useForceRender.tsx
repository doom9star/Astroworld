import { useCallback, useState } from "react";

export function useForceRender() {
  const [, set] = useState(0);
  const render = useCallback(() => {
    set((prev) => prev + 1);
  }, []);
  return render;
}
