import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./slices/global";
import worldReducer from "./slices/world";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    world: worldReducer,
  },
});

export type TRootState = ReturnType<typeof store.getState>;
