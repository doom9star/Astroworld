import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { ELandType } from "../misc/types";
import Base from "./Base";
import Capital from "./Capital";
import Continent from "./Continent";
import Contract from "./Contract";
import File from "./File";
import User from "./User";

@Entity("land")
export default class Land extends Base {
  @Column()
  area: number;

  @Column()
  value: number;

  @Column()
  position: string;

  @Column({
    type: "enum",
    enum: ELandType,
    default: ELandType.NONE,
  })
  type: ELandType;

  @Column()
  available: boolean;

  @ManyToOne(() => User, (user) => user.lands)
  owner: User;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @ManyToOne(() => Continent, (continent) => continent.lands, {
    onDelete: "CASCADE",
  })
  continent: Continent;

  @ManyToMany(() => Contract)
  @JoinTable({ name: "land_contracts" })
  contracts: Contract[];

  capital: Capital | null;
}
