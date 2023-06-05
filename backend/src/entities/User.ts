import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";

import Base from "./Base";
import File from "./File";
import { EGender } from "../misc/types";
import Land from "./Land";
import Conversation from "./Conversation";

@Entity("user")
export default class User extends Base {
  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => File, { cascade: true })
  avatar: File;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({
    type: "enum",
    enum: EGender,
    default: EGender.OTHER,
  })
  gender: EGender;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 100 })
  coins: number;

  @OneToMany(() => Land, (land) => land.owner)
  lands: Land[];

  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  conversation: Conversation;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
