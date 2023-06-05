import { Request, Response } from "express";
import { DataSource } from "typeorm";

export type TPayload = { id: string };
export type TRequest = Request & { user?: TPayload; db?: DataSource };
export type TResponse = Response<{ status: "S" | "F"; data?: any }>;

export enum EFileType {
  FILE,
  IMAGE,
  VIDEO,
  AUDIO,
}

export enum ELandType {
  NONE,
  SHELTER,
  CAPITAL,
  DECORATION,
}

export enum ENotificationType {
  ADMIN,
  NEW_CITIZEN,
  CONTRACT_PENDING,
  CONTRACT_ACCEPTED,
  CONTRACT_REJECTED,
  CONTRACT_NEGOTIATION,
  BUILD_COMPLETION,
}

export enum EContractType {
  LAND_BUY,
  LAND_SALE,
}

export enum EContractStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export enum EGender {
  MALE,
  FEMALE,
  OTHER,
}

export enum ETransactionType {
  LAND_BUY,
  LAND_SALE,
  LAND_BUILD,
  NEW_CITIZEN,
}
