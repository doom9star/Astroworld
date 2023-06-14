import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { ELandType } from "../misc/types";
import Base from "./Base";
import Capital from "./Capital";
import Continent from "./Continent";
import Contract from "./Contract";
import Shelter from "./Shelter";
import User from "./User";
import Warehouse from "./Warehouse";

@Entity("land")
export default class Land extends Base {
  @Column({ default: 0 })
  area: number;

  @Column({ default: 0 })
  value: number;

  @Column({ default: "-1 -1" })
  position: string;

  @Column({
    type: "enum",
    enum: ELandType,
    default: ELandType.NONE,
  })
  type: ELandType;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => User, (user) => user.lands)
  owner: User;

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

  @OneToOne(() => Warehouse, { cascade: true })
  @JoinColumn()
  warehouse: Warehouse;
}
