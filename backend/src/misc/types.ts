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

export enum ENotificationType {
  ADMIN = "0",
  CONTRACT_PENDING = "1",
  CONTRACT_ACCEPTED = "2",
  CONTRACT_REJECTED = "3",
}

export enum ENotificationHandler {
  USER = "0",
  LAND = "1",
  CONTRACT = "2",
}

export enum EContractType {
  NONE = "0",
  LAND_BUY = "1",
  LAND_SALE = "2",
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
  OTHER = "3",
}

export enum ETransactionType {
  NONE = "0",
  LAND = "1",
}
