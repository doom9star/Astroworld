import { Column, Entity, ManyToOne } from "typeorm";
import { EContractStatus, EContractType } from "../misc/types";
import Base from "./Base";
import User from "./User";

@Entity("contract")
export default class Contract extends Base {
  @ManyToOne(() => User, { cascade: true })
  from: User;

  @ManyToOne(() => User, { cascade: true })
  to: User;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 0 })
  dueRate: number;

  @Column()
  expiry: Date;

  @Column({
    type: "enum",
    enum: EContractStatus,
    default: EContractStatus.PENDING,
  })
  status: EContractStatus;

  @Column("text")
  info: string;

  @Column({
    type: "enum",
    enum: EContractType,
    default: EContractType.NONE,
  })
  type: EContractType;
}
