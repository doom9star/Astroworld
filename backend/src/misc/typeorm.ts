import { DataSource } from "typeorm";
import File from "../entities/File";
import User from "../entities/User";

export default function initORM() {
  return new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "karthik",
    password: "karthik",
    database: "astroworld",
    entities: [User, File],
    synchronize: true,
  }).initialize();
}
