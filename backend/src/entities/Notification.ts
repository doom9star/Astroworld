import { Column, Entity } from "typeorm";
import { ENotificationHandler, ENotificationType } from "../misc/types";
import Base from "./Base";

@Entity("notification")
export default class Notification extends Base {
  @Column({ default: false })
  read: boolean;

  @Column("simple-json")
  info: { [k: string]: any };

  @Column("simple-json")
  handlers: { type: ENotificationHandler; info: string }[];

  @Column({
    type: "enum",
    enum: ENotificationType,
    default: ENotificationType.ADMIN,
  })
  type: ENotificationType;
}
