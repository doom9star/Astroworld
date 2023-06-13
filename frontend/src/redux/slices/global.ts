import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { TRootState } from "../store";
import { INotification, ITransaction, IUser, TAlert } from "../types";

type TGlobalState = {
  loading: boolean;
  user: IUser | null;
  alert: TAlert;
  showNotification: boolean;
  showGift: boolean;
  notifications: INotification[];
  gifts: ITransaction[];
};

const globalSlice = createSlice({
  name: "global",
  initialState: {
    loading: true,
    user: null,
    alert: { state: "IDLE", message: "" },
    showNotification: false,
    showGift: false,
    notifications: [],
    gifts: [],
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
    setShowNotification: (state, action: PayloadAction<boolean>) => {
      state.showNotification = action.payload;
    },
    setShowGift: (state, action: PayloadAction<boolean>) => {
      state.showGift = action.payload;
    },
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: INotification[];
        replace: boolean;
      }>
    ) => {
      if (action.payload.replace)
        state.notifications = action.payload.notifications;
      else
        state.notifications = [
          ...action.payload.notifications,
          ...state.notifications,
        ];
    },
    setGifts: (
      state,
      action: PayloadAction<{
        gifts: ITransaction[];
        replace: boolean;
      }>
    ) => {
      if (action.payload.replace) state.gifts = action.payload.gifts;
      else state.gifts = [...action.payload.gifts, ...state.gifts];
    },
  },
});

export const useGlobalState = (): TGlobalState =>
  useSelector((state: TRootState) => state.global);
export const {
  setGlobalLoading,
  setUser,
  setAlert,
  setShowNotification,
  setShowGift,
  setNotifications,
  setGifts,
} = globalSlice.actions;
export default globalSlice.reducer;
