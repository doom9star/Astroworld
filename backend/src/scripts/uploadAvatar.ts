import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import File from "../entities/File";
import uploadBuffer from "../utils/uploadBuffer";
import initORM from "../misc/typeorm";
import { v2 } from "cloudinary";
import { EFileType } from "../misc/types";

const main = async () => {
  dotenv.config({ path: path.join(__dirname, "../../.env") });

  await initORM();
  v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const opath = process.argv[2];

  try {
    if (fs.lstatSync(opath).isDirectory()) {
      for (const fpath of fs.readdirSync(opath)) {
        const file = fs.readFileSync(path.join(opath, fpath));
        const res = await uploadBuffer(file, fpath.split(".")[0] + ".avatar");

        if (res) {
          let file = await File.findOne({
            where: { cid: fpath.split(".")[0] + "-avatar" },
          });
          if (!file) {
            file = new File();
            file.url = res.url;
            file.cid = res.public_id;
            file.type = EFileType.IMAGE;
          }
          await file.save();

          console.log(`${path.join(opath, fpath)} is uploaded successfully!`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};

main();
