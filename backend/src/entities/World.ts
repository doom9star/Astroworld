import { Column, Entity, OneToMany } from "typeorm";
import Base from "./Base";
import Continent from "./Continent";

@Entity("world")
export default class World extends Base {
  @Column()
  name: string;

  @Column()
  area: number;

  @OneToMany(() => Continent, (continent) => continent.world, { cascade: true })
  continents: Continent[];
}
