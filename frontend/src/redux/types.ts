export type TAlert = {
  state: "SUCCESS" | "ERROR" | "IDLE";
  message: string;
};

interface ICommon {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFile extends ICommon {
  url: string;
  cid: string;
}

export enum EGender {
  NONE = "0",
  MALE = "1",
  FEMALE = "2",
  OTHER = "3",
}

export interface IUser extends ICommon {
  name: string;
  email: string;
  avatar: IFile;
  gender: EGender;
  coins: number;
  birthDate: string;
  description: string;
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

export interface IContract extends ICommon {
  from: IUser;
  to: IUser;
  coins: number[];
  dueRate: number;
  expiry: string;
  info: string;
  status: EContractStatus;
  type: EContractType;
  negotiation: { uid: string; coins: number; comment: string }[];
  negotiable: boolean;
}

export enum ELandType {
  NONE = "0",
  SHELTER = "1",
  CAPITAL = "2",
  DECORATION = "3",
}

export interface ICapital extends ICommon {
  area: number;
  locked: boolean;
  operating: boolean;
  thumbnail: IFile;
}

export interface ILand extends ICommon {
  area: number;
  value: number;
  position: string;
  type: ELandType;
  owner: IUser;
  capital: ICapital | null;
  available: boolean;
  thumbnail: IFile;
  continent: IContinent;
  contracts: IContract[];
}

export interface IContinent extends ICommon {
  name: string;
  area: number;
  position: string;
  lands: ILand[];
}

export interface IWorld extends ICommon {
  name: string;
  area: number;
  thumbnail: IFile;
  continents: IContinent[];
}

export enum ENotificationType {
  ADMIN = "0",
  CONTRACT_PENDING = "1",
  CONTRACT_ACCEPTED = "2",
  CONTRACT_REJECTED = "3",
  CONTRACT_NEGOTIATION = "4",
}

export enum ENotificationHandler {
  USER = "0",
  LAND = "1",
  CONTRACT = "2",
}

export interface INotification extends ICommon {
  info: { [k: string]: string };
  read: boolean;
  handlers: { type: ENotificationHandler; info: string }[];
  thumbnail: IFile;
  type: ENotificationType;
}

export interface ITransaction extends ICommon {
  contract: IContract;
}

export interface IComment extends ICommon {
  from: IUser;
  body: string;
}

export enum EMapFilterType {
  ALL = "ALL",
  TERRITORY = "TERRITORY",
  BUY = "BUY",
  SALE = "SALE",
}
