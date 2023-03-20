import { DataSource } from "typeorm";
import Capital from "../entities/Capital";
import Continent from "../entities/Continent";
import Conversation from "../entities/Conversation";
import File from "../entities/File";
import Land from "../entities/Land";
import Message from "../entities/Message";
import Shelter from "../entities/Shelter";
import User from "../entities/User";
import World from "../entities/World";

export default function initORM() {
  return new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "karthik",
    password: "karthik",
    database: "astroworld",
    entities: [
      User,
      File,
      World,
      Continent,
      Land,
      Shelter,
      Capital,
      Conversation,
      Message,
    ],
    synchronize: true,
    logging: true,
  }).initialize();
}
