import { Column, Entity, ManyToOne } from "typeorm";
import Base from "./Base";
import User from "./User";

@Entity("comment")
export default class Comment extends Base {
  @ManyToOne(() => User, { cascade: true })
  from: User;

  @Column("text")
  body: string;
}
