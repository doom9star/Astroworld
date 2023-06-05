import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import Land from "./Land";

@Entity("shelter")
export default class Shelter extends Base {
  @Column({ default: 0 })
  value: number;

  @Column({ default: "[null]" })
  paint: string;

  @Column({ default: 0 })
  type: number;

  @Column()
  built: Date;

  @Column({ default: false })
  locked: boolean;

  @OneToOne(() => Land, (l) => l.shelter, { onDelete: "CASCADE" })
  land: Land;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;
}
