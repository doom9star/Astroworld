import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import Base from "./Base";
import Continent from "./Continent";
import File from "./File";

@Entity("world")
export default class World extends Base {
  @Column()
  name: string;

  @Column()
  area: number;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  thumbnail: File;

  @OneToMany(() => Continent, (continent) => continent.world, { cascade: true })
  continents: Continent[];
}
