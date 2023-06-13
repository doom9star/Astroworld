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

  @Column({ default: 0 })
  coins: number;

  @Column({ default: true })
  completed: boolean;

  @Column({
    type: "enum",
    enum: ETransactionType,
  })
  type: ETransactionType;
}
