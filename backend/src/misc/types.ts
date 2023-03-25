import { Request } from "express";
import { DataSource } from "typeorm";

export type TPayload = { id: string };
export type TAuthRequest = Request & { user?: TPayload; db?: DataSource };

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
  DECORATION = "3",
}

export enum EContractType {
  NONE = "0",
  PURCHASE = "1",
}

export enum EContractStatus {
  PENDING = "0",
  ACCEPTED = "1",
  REJECTED = "2",
}

export enum EGender {
  NONE = "0",
  MALE = "1",
  FEMALE = "2",
}
