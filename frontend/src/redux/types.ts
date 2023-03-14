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
  birthDate: string;
  description: string;
}

export enum ELandType {
  NONE = "0",
  SHELTER = "1",
}

export interface ILand extends ICommon {
  area: number;
  cost: number;
  position: string;
  type: ELandType;
  owner: IUser;
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
