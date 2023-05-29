import { Router } from "express";
import { Not } from "typeorm";
import { v4 } from "uuid";
import Contract from "../entities/Contract";
import File from "../entities/File";
import Land from "../entities/Land";
import Notification from "../entities/Notification";
import Shelter from "../entities/Shelter";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import {
  EContractStatus,
  EContractType,
  ELandType,
  ENotificationHandler,
  ENotificationType,
  ETransactionType,
  TAuthRequest,
} from "../misc/types";
import getResponse from "../utils/getResponse";
import Transaction from "../entities/Transaction";
import Capital from "../entities/Capital";

const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  const land = await Land.findOne({
    where: { id: req.params.id },
    relations: [
      "owner",
      "thumbnail",
      "continent",
      "capital",
      "capital.thumbnail",
      "shelter",
      "shelter.thumbnail",
    ],
  });
  return res.json(getResponse("SUCCESS", "Land retrieved successfully!", land));
});

router.post("/:id/contract", isAuth, async (req: TAuthRequest, res) => {
  const contract = new Contract();
  contract.to = <any>{ id: req.body.to };
  contract.coins = [parseInt(req.body.coins)];
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

router.post("/:id/build/:type", isAuth, async (req: TAuthRequest, res) => {
  const type = req.params.type as ELandType;
  if (type === ELandType.SHELTER) {
    const shelter = new Shelter();
    shelter.value = req.body.value;
    shelter.paint = req.body.paint;
    shelter.built = req.body.built;
    shelter.locked = true;
    shelter.thumbnail = new File();
    shelter.thumbnail.cid = `shelter-${v4()}`;
    shelter.thumbnail.url = `/images/houses/${req.body.type}/${req.body.paint}.png`;
    shelter.land = <any>{ id: req.params.id };
    await shelter.save();

    await User.getRepository().decrement(
      { id: req.user?.id },
      "coins",
      shelter.value
    );

    await Capital.getRepository().increment(
      {
        land: { id: req.params.id },
      },
      "reserve",
      shelter.value
    );

    const transaction = new Transaction();
    transaction.from = <any>{ id: req.user?.id };
    transaction.coins = shelter.value;
    transaction.type = ETransactionType.LAND_BUILD;
    await transaction.save();

    return res.json(
      getResponse("SUCCESS", "Shelter created successfully!", shelter)
    );
  }
  return res.json(getResponse("ERROR", "Build failed!"));
});

export default router;
