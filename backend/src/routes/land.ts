import { Router } from "express";
import Capital from "../entities/Capital";
import Contract from "../entities/Contract";
import Land from "../entities/Land";
import isAuth from "../middlewares/isAuth";
import { TAuthRequest, EContractType } from "../misc/types";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  const land = await Land.findOne({
    where: { id: req.params.id },
    relations: ["owner", "thumbnail", "continent"],
  });
  if (land) {
    const capital = await Capital.findOne({
      where: { land: { id: req.params.id } },
      relations: ["thumbnail"],
    });
    land.capital = capital;
  }
  return res.json(getResponse("SUCCESS", "Land retrieved successfully!", land));
});

router.post("/:id/contract", isAuth, async (req: TAuthRequest, res) => {
  const contract = new Contract();
  contract.from = req.body.from;
  contract.to = req.body.to;
  contract.coins = req.body.coins;
  contract.expiry = req.body.expiry;
  contract.info = req.body.info;
  contract.type = EContractType.PURCHASE;
  await contract.save();

  await req.db
    ?.createQueryBuilder()
    .relation(Land, "contracts")
    .of(req.params.id)
    .add(contract);
  return res.json(
    getResponse("SUCCESS", "Contract created successfully!", contract)
  );
});

export default router;
