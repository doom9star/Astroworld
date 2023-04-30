import { Router } from "express";
import Contract from "../entities/Contract";
import isAuth from "../middlewares/isAuth";
import Transaction from "../entities/Transaction";
import getResponse from "../utils/getResponse";
import {
  EContractStatus,
  EContractType,
  ENotificationHandler,
  ENotificationType,
  TAuthRequest,
} from "../misc/types";
import Notification from "../entities/Notification";
import { v4 } from "uuid";
import File from "../entities/File";
import Land from "../entities/Land";
import { Not } from "typeorm";
import User from "../entities/User";

const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  const contract = await Contract.findOne({
    where: { id: req.params.id },
    relations: ["from", "to"],
  });
  return res.json(
    getResponse("SUCCESS", "Contract retrieved successfully!", contract)
  );
});

router.post("/:id/sign", isAuth, async (req: TAuthRequest, res) => {
  const contract = await Contract.findOne({
    where: { id: req.params.id },
    relations: ["from", "to"],
  });

  if (contract) {
    contract.status = req.body.sign;
    const lid = contract.info.split("|")[1];

    if (contract.type === EContractType.LAND_SALE) {
      contract.from = <any>await User.findOne({ where: { id: req.user?.id } });
    }

    if (req.body.sign === EContractStatus.ACCEPTED) {
      const coins = contract.coins.slice(-1)[0];
      contract.from.coins -= coins;
      contract.to.coins += coins;
      await Land.update({ id: lid }, { owner: contract.from, value: coins });

      await Contract.update(
        {
          id: Not(contract.id),
          status: EContractStatus.PENDING,
          land: { id: lid },
        },
        { status: EContractStatus.REJECTED }
      );

      const transaction = new Transaction();
      transaction.contract = contract;
      await transaction.save();
    }

    const notification = new Notification();
    notification.handlers = [
      {
        type: ENotificationHandler.CONTRACT,
        info: `${contract.type}|${contract.id}`,
      },
      { type: ENotificationHandler.LAND, info: lid },
      { type: ENotificationHandler.USER, info: req.user!.id },
    ];
    notification.type =
      req.body.sign === EContractStatus.ACCEPTED
        ? ENotificationType.CONTRACT_ACCEPTED
        : ENotificationType.CONTRACT_REJECTED;
    notification.info = {
      world: req.body.wid,
      user:
        contract.type === EContractType.LAND_BUY
          ? contract.from.id
          : contract.to.id,
    };
    notification.thumbnail = new File();
    notification.thumbnail.cid = `notification-${v4()}`;
    notification.thumbnail.url = "/images/contract.png";
    await notification.save();

    await contract.save();
  }

  return res.json(
    getResponse("SUCCESS", "Contract status updated successfully!", contract)
  );
});

router.post("/:id/negotiate", isAuth, async (req: TAuthRequest, res) => {
  const contract = await Contract.findOne({ where: { id: req.params.id } });
  if (contract) {
    contract.negotiation = [
      {
        uid: req.user?.id as any,
        coins: req.body.coins,
        comment: req.body.comment,
      },
      ...contract.negotiation,
    ];
    contract.coins = req.body.coins;
    await contract.save();

    const notification = new Notification();
    notification.handlers = [
      {
        type: ENotificationHandler.CONTRACT,
        info: `${contract.type}|${contract.id}`,
      },
      { type: ENotificationHandler.LAND, info: contract.info.split("|")[1] },
      { type: ENotificationHandler.USER, info: req.user!.id },
    ];
    notification.type = ENotificationType.CONTRACT_NEGOTIATION;
    notification.info = {
      world: req.body.wid,
      user: req.body.to,
    };
    notification.thumbnail = new File();
    notification.thumbnail.cid = `notification-${v4()}`;
    notification.thumbnail.url = "/images/contract.png";
    await notification.save();
  }
  return res.json(
    getResponse("SUCCESS", "Contract negotiation added!", contract?.negotiation)
  );
});

export default router;
