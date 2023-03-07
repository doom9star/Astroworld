import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import Land from "./Land";
import World from "./World";

@Entity("continent")
export default class Continent extends Base {
  @Column()
  name: string;

  @Column()
  area: number;

  @Column("point")
  position: string;

  @ManyToOne(() => World, (world) => world.continents)
  world: World;

  @OneToMany(() => Land, (land) => land.continent)
  lands: Land[];
}
