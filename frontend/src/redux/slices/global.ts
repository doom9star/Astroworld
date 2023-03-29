import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { IUser, TAlert } from "../types";

type TGlobalState = {
  loading: boolean;
  user: IUser | null;
  alert: TAlert;
  notification: boolean;
};

const globalSlice = createSlice({
  name: "global",
  initialState: {
    loading: true,
    user: null,
    alert: { state: "IDLE", message: "" },
    notification: false,
  } as TGlobalState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
    setAlert: (state, action: PayloadAction<TAlert>) => {
      state.alert = action.payload;
    },
    setNotification: (state, action: PayloadAction<boolean>) => {
      state.notification = action.payload;
    },
  },
});

export const useGlobalState = (): TGlobalState =>
  useSelector((state: TRootState) => state.global);
export const { setGlobalLoading, setUser, setAlert, setNotification } =
  globalSlice.actions;
export default globalSlice.reducer;
