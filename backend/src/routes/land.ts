import { Router } from "express";
import Capital from "../entities/Capital";
import Land from "../entities/Land";
import isAuth from "../middlewares/isAuth";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  const land = await Land.findOne({
    where: { id: req.query.id as string },
    relations: ["owner", "thumbnail", "continent"],
  });
  if (land) {
    const capital = await Capital.findOne({
      where: { land: { id: req.query.id as string } },
      relations: ["thumbnail"],
    });
    land.capital = capital;
  }
  return res.json(getResponse("SUCCESS", "Land retrieved successfully!", land));
});

export default router;
