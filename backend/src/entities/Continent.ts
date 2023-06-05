import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import Land from "./Land";
import World from "./World";

@Entity("continent")
export default class Continent extends Base {
  @Column({ default: "unknown" })
  name: string;

  @Column({ default: 0 })
  area: number;

  @Column({ default: "-1 -1" })
  position: string;

  @ManyToOne(() => World, (world) => world.continents, { onDelete: "CASCADE" })
  world: World;

  @OneToMany(() => Land, (land) => land.continent, { cascade: true })
  lands: Land[];
}
