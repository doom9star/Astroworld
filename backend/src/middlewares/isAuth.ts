import { NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { COOKIE_NAME } from "../misc/constants";
import { TPayload, TRequest, TResponse } from "../misc/types";

export default (req: TRequest, res: TResponse, next: NextFunction) => {
  try {
    if (!req.cookies[COOKIE_NAME])
      throw new JsonWebTokenError("Token is missing!");
    const payload = jwt.verify(
      req.cookies[COOKIE_NAME],
      (process.env as any).JWT_PRIVATE_KEY
    ) as TPayload;
    req.user = payload;
    next();
  } catch (error: any) {
    console.error(error.message);
    return res.json({ status: "F", data: error.message });
  }
};
