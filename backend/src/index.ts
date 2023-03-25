import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import "reflect-metadata";

import initORM from "./misc/typeorm";
import { TAuthRequest } from "./misc/types";
import MainRouter from "./routes";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  const db = await initORM();

  const app = express();

  app.use(
    cors({ credentials: true, origin: [process.env.FRONTEND as string] })
  );
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use((req: TAuthRequest, _, next) => {
    req.db = db;
    next();
  });
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}`);
  });
};

main();
