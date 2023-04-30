import { Router } from "express";
import { v4 } from "uuid";
import Capital from "../entities/Capital";
import Comment from "../entities/Comment";
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
  EContractStatus,
} from "../misc/types";
import getResponse from "../utils/getResponse";
import { Not } from "typeorm";

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
  contract.to = <any>{ id: req.body.to };
  contract.coins = [req.body.coins];
  contract.expiry = req.body.expiry;
  contract.info = `land|${req.params.id}`;
  contract.negotiation = [
    {
      uid: req.user?.id as any,
      coins: req.body.coins,
      comment: req.body.comment,
    },
  ];
  contract.negotiable = req.body.negotiable;
  contract.type = req.body.type;
  contract.land = <any>{ id: req.params.id };
  if (contract.type === EContractType.LAND_BUY) {
    contract.from = <any>{ id: req.body.from };
  }
  await contract.save();

  if (contract.type === EContractType.LAND_BUY) {
    const notification = new Notification();
    notification.handlers = [
      {
        type: ENotificationHandler.CONTRACT,
        info: `${contract.type}|${contract.id}`,
      },
      { type: ENotificationHandler.LAND, info: req.params.id },
      { type: ENotificationHandler.USER, info: req.body.from },
    ];
    notification.type = ENotificationType.CONTRACT_PENDING;
    notification.info = { world: req.body.wid, user: req.body.to };
    notification.thumbnail = new File();
    notification.thumbnail.cid = `notification-${v4()}`;
    notification.thumbnail.url = "/images/contract.png";
    await notification.save();
  } else {
    await Contract.update(
      {
        id: Not(contract.id),
        status: EContractStatus.PENDING,
        land: { id: req.params.id },
      },
      { status: EContractStatus.REJECTED }
    );
  }

  return res.json(
    getResponse("SUCCESS", "Contract created successfully!", contract)
  );
});

router.get("/:id/contract/:type", isAuth, async (req, res) => {
  const contracts = await Contract.find({
    where: {
      land: { id: req.params.id },
      type: req.params.type as EContractType,
    },
    relations: ["from"],
    order: { createdAt: "DESC" },
  });
  return res.json(
    getResponse("SUCCESS", "Contracts retreived successfully!", contracts)
  );
});

export default router;
