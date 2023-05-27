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
  reserve: number;

  @Column()
  operating: boolean;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @OneToOne(() => Land, (l) => l.capital, { onDelete: "CASCADE" })
  land: Land;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;
}
