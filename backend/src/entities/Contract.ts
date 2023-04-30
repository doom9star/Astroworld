import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EContractStatus, EContractType } from "../misc/types";
import Base from "./Base";
import Comment from "./Comment";
import Land from "./Land";
import User from "./User";

@Entity("contract")
export default class Contract extends Base {
  @ManyToOne(() => User, { cascade: true })
  from: User;

  @ManyToOne(() => User, { cascade: true })
  to: User;

  @Column("simple-array")
  coins: number[];

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

  @Column()
  info: string;

  @Column()
  negotiable: boolean;

  @Column({
    type: "enum",
    enum: EContractType,
    default: EContractType.NONE,
  })
  type: EContractType;

  @Column("simple-json")
  negotiation: { uid: string; coins: number; comment: string }[];

  @ManyToOne(() => Land, (land) => land.contracts)
  land: Land;
}
