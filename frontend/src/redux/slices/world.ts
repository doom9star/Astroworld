import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { IWorld } from "../types";

type TWorldState = {
  worlds: IWorld[];
  world: IWorld | null;
};

const worldSlice = createSlice({
  name: "world",
  initialState: {
    worlds: [],
    world: null,
  } as TWorldState,
  reducers: {
    setWorlds: (state, action: PayloadAction<IWorld[]>) => {
      state.worlds = action.payload;
    },
    setWorld: (state, action: PayloadAction<IWorld>) => {
      state.world = action.payload;
    },
  },
});

export const useWorldState = (): TWorldState =>
  useSelector((state: TRootState) => state.world);
export const { setWorlds, setWorld } = worldSlice.actions;
export default worldSlice.reducer;
