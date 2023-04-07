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

    if (req.body.sign === EContractStatus.ACCEPTED) {
      if (contract.type === EContractType.LAND_BUY) {
        contract.from.coins -= contract.coins;
        contract.to.coins += contract.coins;
        await Land.update({ id: lid }, { owner: contract.from });
      }

      const transaction = new Transaction();
      transaction.contract = contract;
      await transaction.save();
    }

    const notification = new Notification();
    notification.handlers = [
      { type: ENotificationHandler.CONTRACT, info: contract.id },
      { type: ENotificationHandler.LAND, info: lid },
      { type: ENotificationHandler.USER, info: req.body.from },
    ];
    notification.type =
      req.params.sign === EContractStatus.ACCEPTED
        ? ENotificationType.CONTRACT_ACCEPTED
        : ENotificationType.CONTRACT_REJECTED;
    notification.info = { world: req.body.wid, user: req.body.to };
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

export default router;
