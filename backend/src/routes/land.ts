import { Router } from "express";
import Capital from "../entities/Capital";
import File from "../entities/File";
import Land from "../entities/Land";
import isAuth from "../middlewares/isAuth";
import { ELandType, TAuthRequest } from "../misc/types";
import getResponse from "../utils/getResponse";

const router = Router();

router.post("/", isAuth, async (req: TAuthRequest, res) => {
  const capital = new Capital();
  capital.area = 250;
  capital.locked = false;
  capital.operating = true;
  capital.thumbnail = new File();
  capital.thumbnail.url = "/images/houses/House v3/house 3 blue.png";
  capital.thumbnail.cid = "capital-oasis";
  capital.land = (await Land.findOne({
    where: { id: req.body.landId },
    relations: ["thumbnail"],
  })) as Land;
  capital.land.type = ELandType.CAPITAL;
  capital.land.available = false;
  capital.land.owner = <any>{ id: req.user?.id };
  capital.land.thumbnail = capital.land.thumbnail
    ? capital.land.thumbnail
    : new File();
  capital.land.thumbnail.cid = `53680a89-41ad-4d65-9e6d-2ff727b42086_decoration`;
  capital.land.thumbnail.url = "/images/decorations/leaves2.png";
  await capital.land.save();
  await capital.save();
  return res.json(
    getResponse("SUCCESS", "Land created successfully!", capital)
  );
});

export default router;
