import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "./Base";
import File from "./File";
import Message from "./Message";
import User from "./User";

@Entity("conversation")
export default class Conversation extends Base {
  @Column({ nullable: true })
  expiry: Date;

  @OneToMany(() => User, (participant) => participant.conversation)
  participants: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToOne(() => File)
  @JoinColumn()
  background: File;
}
