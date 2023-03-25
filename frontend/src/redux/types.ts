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

export interface IUser extends ICommon {
  name: string;
  email: string;
  avatar: IFile;
  coins: number;
  birthDate: string;
  description: string;
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

export interface IContract extends ICommon {
  from: IUser;
  to: IUser;
  coins: number;
  dueRate: number;
  expiry: string;
  info: string;
  status: EContractStatus;
  type: EContractType;
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
