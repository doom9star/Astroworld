import { Request } from "express";

export type TPayload = { id: string };
export type TAuthRequest = Request & { user?: TPayload };

export enum EFileType {
  IMAGE = "0",
  VIDEO = "1",
  AUDIO = "2",
  FILE = "3",
}

export enum ELandType {
  NONE = "0",
  SHELTER = "1",
  CAPITAL = "2",
}

export enum EGender {
  NONE = "0",
  MALE = "1",
  FEMALE = "2",
}
