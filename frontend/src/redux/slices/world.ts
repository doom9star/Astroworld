import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { IWorld } from "../types";

type TWorldState = {
  worlds: IWorld[];
};

const worldSlice = createSlice({
  name: "world",
  initialState: {
    worlds: [],
  } as TWorldState,
  reducers: {
    setWorlds: (state, action: PayloadAction<IWorld[]>) => {
      state.worlds = action.payload;
    },
  },
});

export const useWorldState = (): TWorldState =>
  useSelector((state: TRootState) => state.world);
export const { setWorlds } = worldSlice.actions;
export default worldSlice.reducer;
