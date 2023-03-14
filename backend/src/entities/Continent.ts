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

  @Column()
  position: string;

  @ManyToOne(() => World, (world) => world.continents, { onDelete: "CASCADE" })
  world: World;

  @OneToMany(() => Land, (land) => land.continent, { cascade: true })
  lands: Land[];
}
