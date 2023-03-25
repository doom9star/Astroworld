import { Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import Contract from "./Contract";

@Entity("transaction")
export default class Transaction extends Base {
  @ManyToOne(() => Contract)
  contract: Contract;
}
