import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "./Base";
import Land from "./Land";

@Entity("shelter")
export default class Shelter extends Base {
  @Column()
  name: string;

  @Column()
  area: number;

  @Column("point")
  position: string;

  @Column()
  paint: string;

  @Column()
  locked: Boolean;

  @OneToOne(() => Land)
  @JoinColumn()
  land: Land;
}
