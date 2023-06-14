import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import Base from "./Base";
import Land from "./Land";
import File from "./File";

@Entity("warehouse")
export default class Warehouse extends Base {
  @Column({ default: 0 })
  value: number;

  @Column({ default: "[null]" })
  paint: string;

  @Column()
  built: Date;

  @Column({ default: false })
  locked: boolean;

  @Column({ type: "simple-json" })
  categories: { [c: string]: string[] };

  @OneToMany(() => File, (f) => f.warehouse, { cascade: true })
  files: File[];

  @OneToOne(() => Land, (l) => l.warehouse, { onDelete: "CASCADE" })
  land: Land;
}
