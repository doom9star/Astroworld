import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Conversation from "./Conversation";
import File from "./File";
import Land from "./Land";

@Entity("shelter")
export default class Shelter extends Base {
  @Column()
  value: number;

  @Column()
  paint: string;

  @Column()
  built: Date;

  @Column()
  locked: boolean;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @OneToOne(() => Land, (l) => l.shelter, { onDelete: "CASCADE" })
  land: Land;

  @OneToOne(() => Conversation)
  @JoinColumn()
  conversation: Conversation;
}
