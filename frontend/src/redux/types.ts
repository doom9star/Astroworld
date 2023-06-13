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
  MALE,
  FEMALE,
  OTHER,
}

export interface IUser extends ICommon {
  email: string;
  gender: EGender;
  coins: number;
  name?: string;
  avatar?: IFile;
  birthDate?: string;
  description?: string;
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

export interface IContract extends ICommon {
  coins: number;
  dueRate: number;
  expiry: string;
  status: EContractStatus;
  type: EContractType;
  negotiation: { uid: string; coins: number; comment: string }[];
  negotiable: boolean;
  from?: IUser;
  to?: IUser;
  info?: string;
}

export enum ELandType {
  NONE,
  SHELTER,
  CAPITAL,
  DECORATION,
  WAREHOUSE,
}

export enum EBuildable {
  SHELTER = 1,
  WAREHOUSE = 4,
}

export interface ICapital extends ICommon {
  area: number;
  locked: boolean;
  reserve: number;
  operating: boolean;
}

export interface IShelter extends ICommon {
  value: number;
  paint: string;
  type: number;
  built: string;
  locked: boolean;
}

export interface ILand extends ICommon {
  area: number;
  value: number;
  position: string;
  type: ELandType;
  owner: IUser;
  available: boolean;
  continent: IContinent;
  contracts: IContract[];
  capital?: ICapital;
  shelter?: IShelter;
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
  continents: IContinent[];
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

export enum ETransactionType {
  LAND_BUY,
  LAND_SALE,
  LAND_BUILD,
  NEW_CITIZEN,
  LOGIN_GIFT,
}

export interface INotification extends ICommon {
  info: any[];
  read: boolean;
  handlers: any[];
  type: ENotificationType;
}

export interface ITransaction extends ICommon {
  from?: IUser;
  to?: IUser;
  coins: number;
  completed: boolean;
  type: ETransactionType;
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

export type TResponse = {
  status: "S" | "F";
  data?: any;
};
