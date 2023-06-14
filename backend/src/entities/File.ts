import { Column, Entity, ManyToOne } from "typeorm";
import { EFileType } from "../misc/types";
import Base from "./Base";
import Warehouse from "./Warehouse";

@Entity("file")
export default class File extends Base {
  @Column()
  url: string;

  @Column()
  cid: string;

  @Column({ type: "enum", enum: EFileType, default: EFileType.FILE })
  type: EFileType;

  @ManyToOne(() => Warehouse, (w) => w.files, { onDelete: "CASCADE" })
  warehouse: Warehouse;
}
