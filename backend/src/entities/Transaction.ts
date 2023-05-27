import { Column, Entity, ManyToOne } from "typeorm";
import { ETransactionType } from "../misc/types";
import Base from "./Base";
import User from "./User";

@Entity("transaction")
export default class Transaction extends Base {
  @ManyToOne(() => User, { cascade: true })
  from: User;

  @ManyToOne(() => User, { cascade: true })
  to: User;

  @Column()
  coins: number;

  @Column({
    type: "enum",
    enum: ETransactionType,
    default: ETransactionType.NONE,
  })
  type: ETransactionType;
}
