import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import File from "./File";
import User from "./User";

@Entity("message")
export default class Message extends Base {
  @Column("text")
  body: string;

  @OneToOne(() => File)
  @JoinColumn()
  image: File;

  @OneToOne(() => File)
  @JoinColumn()
  audio: File;

  @OneToOne(() => File)
  @JoinColumn()
  video: File;

  @OneToOne(() => File)
  @JoinColumn()
  file: File;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  conversation: Conversation;
}
