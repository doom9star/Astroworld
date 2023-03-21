import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import File from "./File";
import Land from "./Land";

@Entity("capital")
export default class Capital extends Base {
  @Column()
  locked: boolean;

  @Column()
  operating: boolean;

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
