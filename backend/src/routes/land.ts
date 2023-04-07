import { Router } from "express";
import { v4 } from "uuid";
import Capital from "../entities/Capital";
import Contract from "../entities/Contract";
import File from "../entities/File";
import Land from "../entities/Land";
import Notification from "../entities/Notification";
import isAuth from "../middlewares/isAuth";
import {
  TAuthRequest,
  EContractType,
  ENotificationHandler,
  ENotificationType,
} from "../misc/types";
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
  contract.info = `land|${req.params.id}`;
  contract.type = EContractType.LAND_BUY;
  await contract.save();

  const notification = new Notification();
  notification.handlers = [
    { type: ENotificationHandler.CONTRACT, info: contract.id },
    { type: ENotificationHandler.LAND, info: req.params.id },
    { type: ENotificationHandler.USER, info: req.body.from },
  ];
  notification.type = ENotificationType.CONTRACT_PENDING;
  notification.info = { world: req.body.wid, user: req.body.to };
  notification.thumbnail = new File();
  notification.thumbnail.cid = `notification-${v4()}`;
  notification.thumbnail.url = "/images/contract.png";
  await notification.save();

  await req.db
    ?.createQueryBuilder()
    .relation(Land, "contracts")
    .of(req.params.id)
    .add(contract);
  return res.json(
    getResponse("SUCCESS", "Contract created successfully!", contract)
  );
});

router.get("/:id/contract/:type", isAuth, async (req, res) => {
  const land = await Land.findOne({
    where: { id: req.params.id },
    relations: ["contracts", "contracts.from"],
  });
  const contracts = land?.contracts.filter((c) => c.type === req.params.type);
  return res.json(
    getResponse("SUCCESS", "Contracts retreived successfully!", contracts)
  );
});

export default router;
