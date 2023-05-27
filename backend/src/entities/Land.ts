import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { ELandType } from "../misc/types";
import Base from "./Base";
import Capital from "./Capital";
import Continent from "./Continent";
import Contract from "./Contract";
import File from "./File";
import User from "./User";
import Shelter from "./Shelter";

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

  @OneToMany(() => Contract, (contract) => contract.land)
  contracts: Contract[];

  @OneToOne(() => Capital, { cascade: true })
  @JoinColumn()
  capital: Capital;

  @OneToOne(() => Shelter, { cascade: true })
  @JoinColumn()
  shelter: Shelter;
}
