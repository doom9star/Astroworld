export type TResponseStatus = "SUCCESS" | "ERROR";
export type TResponse = {
  status: TResponseStatus;
  message: string;
  data?: any;
};
