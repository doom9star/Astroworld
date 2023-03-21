import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import File from "./File";
import Land from "./Land";

@Entity("shelter")
export default class Shelter extends Base {
  @Column()
  name: string;

  @Column()
  locked: boolean;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @OneToOne(() => Land, { onDelete: "CASCADE" })
  @JoinColumn()
  land: Land;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;
}
