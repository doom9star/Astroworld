import { Column, Entity, ManyToOne } from "typeorm";
import { ELandType } from "../misc/types";
import Base from "./Base";
import Continent from "./Continent";
import User from "./User";

@Entity("land")
export default class Land extends Base {
  @Column()
  area: number;

  @Column()
  cost: number;

  @Column()
  position: string;

  @Column({
    type: "enum",
    enum: ELandType,
    default: ELandType.NONE,
  })
  type: ELandType;

  @ManyToOne(() => User, (user) => user.lands)
  owner: User;

  @ManyToOne(() => Continent, (continent) => continent.lands, {
    onDelete: "CASCADE",
  })
  continent: Continent;
}
