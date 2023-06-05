import { Router } from "express";
import { Not } from "typeorm";
import postNotification from "../controllers/postNotification";
import postTransaction from "../controllers/postTransaction";
import Contract from "../entities/Contract";
import Land from "../entities/Land";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import {
  EContractStatus,
  EContractType,
  ENotificationType,
  ETransactionType,
  TRequest,
  TResponse,
} from "../misc/types";

const router = Router();

router.get("/sale", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    const contracts = await Contract.find({
      where: { type: EContractType.LAND_SALE, status: EContractStatus.PENDING },
      relations: ["to"],
      order: {
        createdAt: "DESC",
      },
    });

    return res.json({ status: "S", data: contracts });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get("/:id", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.id },
      relations: ["from", "to"],
    });

    return res.json({ status: "S", data: contract });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/:id/sign", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.id },
      relations: ["from", "to"],
    });

    if (contract) {
      contract.status = req.body.sign;
      const lid = contract.info.split(":")[1];

      if (contract.type === EContractType.LAND_SALE) {
        contract.from = <any>await User.findOne({
          where: {
            id:
              req.user?.id === contract.to.id
                ? contract.negotiation[0].uid
                : req.user?.id,
          },
        });
      }

      if (req.body.sign === EContractStatus.ACCEPTED) {
        const coins = contract.coins;
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

        await postTransaction({
          from: contract.from,
          to: contract.to,
          type:
            contract.type === EContractType.LAND_BUY
              ? ETransactionType.LAND_BUY
              : ETransactionType.LAND_SALE,
          coins,
        });
      }

      await postNotification({
        type:
          req.body.sign === EContractStatus.ACCEPTED
            ? ENotificationType.CONTRACT_ACCEPTED
            : ENotificationType.CONTRACT_REJECTED,
        info: [
          `user:${
            req.user?.id === contract.from.id
              ? contract.to.id
              : contract.from.id
          }`,
          `world:${req.body.wid}`,
        ],
        handlers: [
          `user:${req.user?.id}`,
          `land:${lid}`,
          `contract:${contract.type}|${contract.id}`,
        ],
      });

      await contract.save();
    }

    return res.json({ status: "S", data: contract });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/:id/negotiate", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.id },
      relations: ["from", "to"],
    });
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

      const notification = {
        type: ENotificationType.CONTRACT_NEGOTIATION,
        info: [
          `to:${
            req.user?.id === contract.from.id
              ? contract.to.id
              : contract.from.id
          }`,
          `world:${req.body.wid}`,
        ],
        handlers: [
          `user:${req.user?.id}`,
          `land:${contract.info.split(":")[1]}`,
          `contract:${contract.type}|${contract.id}`,
        ],
      };

      if (contract.type === EContractType.LAND_BUY) {
        await postNotification(notification);
      } else {
        const uids = contract.negotiation
          .map((n) => n.uid)
          .filter((uid) => uid !== req.user?.id);
        await Promise.all(
          uids.map(async (uid) => {
            notification.info[0] = `to:${uid}`;
            await postNotification(notification);
          })
        );
      }
    }

    return res.json({ status: "S", data: contract?.negotiation });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
