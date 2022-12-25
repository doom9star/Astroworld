import dotenv from "dotenv";
import express from "express";
import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import User from "./entities/User";
import MainRouter from "./routes";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../.env") });

  await new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "astroworld",
    entities: [User],
    synchronize: true,
    logging: false,
  }).initialize();

  const app = express();

  app.use(
    cors({ credentials: true, origin: [process.env.FRONTEND as string] })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/", MainRouter);

  app.listen(process.env.PORT, () => {
    console.log(`\nServer running on http://localhost:${process.env.PORT}`);
  });
};

main();
