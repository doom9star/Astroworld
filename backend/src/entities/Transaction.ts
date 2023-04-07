import { Column, Entity, ManyToOne } from "typeorm";
import { ETransactionType } from "../misc/types";
import Base from "./Base";
import Contract from "./Contract";
import User from "./User";

@Entity("transaction")
export default class Transaction extends Base {
  @ManyToOne(() => Contract)
  contract: Contract;
}
