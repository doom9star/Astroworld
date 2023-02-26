import { Column, Entity } from "typeorm";
import { EFileType } from "../misc/types";
import Base from "./Base";

@Entity("file")
export default class File extends Base {
  @Column()
  url: string;

  @Column()
  cid: string;

  @Column({ type: "enum", enum: EFileType, default: EFileType.AVATAR })
  type: EFileType;
}
