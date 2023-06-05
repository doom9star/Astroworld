import { NextFunction, Request } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { COOKIE_NAME } from "../misc/constants";
import { TResponse } from "../misc/types";

export default (req: Request, res: TResponse, next: NextFunction) => {
  try {
    if (!req.cookies[COOKIE_NAME])
      throw new JsonWebTokenError("Token is missing!");
    jwt.verify(req.cookies[COOKIE_NAME], (process.env as any).JWT_PRIVATE_KEY);
    return res.json({ status: "F" });
  } catch (error: any) {
    console.error(error.message);
    next();
  }
};
