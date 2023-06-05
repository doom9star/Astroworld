import { Column, Entity } from "typeorm";
import { ENotificationType } from "../misc/types";
import Base from "./Base";

@Entity("notification")
export default class Notification extends Base {
  @Column({ default: false })
  read: boolean;

  @Column("simple-array", { nullable: true })
  info: any[];

  @Column("simple-array", { nullable: true })
  handlers: any[];

  @Column({
    type: "enum",
    enum: ENotificationType,
    default: ENotificationType.ADMIN,
  })
  type: ENotificationType;
}
