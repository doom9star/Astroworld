import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import Land from "./Land";

@Entity("capital")
export default class Capital extends Base {
  @Column({ default: true })
  locked: boolean;

  @Column({ default: 0 })
  reserve: number;

  @Column({ default: false })
  operating: boolean;

  @OneToOne(() => Land, (l) => l.capital, { onDelete: "CASCADE" })
  land: Land;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;
}
