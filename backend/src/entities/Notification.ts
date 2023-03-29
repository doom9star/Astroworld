import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ENotificationHandler, ENotificationType } from "../misc/types";
import Base from "./Base";
import File from "./File";

@Entity("notification")
export default class Notification extends Base {
  @Column({ default: false })
  read: boolean;

  @Column("simple-json")
  handlers: { type: ENotificationHandler; info: string }[];

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @Column({
    type: "enum",
    enum: ENotificationType,
    default: ENotificationType.ADMIN,
  })
  type: ENotificationType;
}
