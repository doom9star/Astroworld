import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import bcrypt from "bcryptjs";

import Base from "./Base";
import File from "./File";

@Entity("user")
export default class User extends Base {
  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => File)
  avatar: File;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  description: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
