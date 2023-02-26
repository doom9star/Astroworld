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
  avatar: File;
  birthDate: string;
  description: string;
}
