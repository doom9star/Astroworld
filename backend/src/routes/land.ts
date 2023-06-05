import { Router } from "express";
import { Not } from "typeorm";
import postNotification from "../controllers/postNotification";
import postTransaction from "../controllers/postTransaction";
import Capital from "../entities/Capital";
import Contract from "../entities/Contract";
import Land from "../entities/Land";
import Shelter from "../entities/Shelter";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import {
  EContractStatus,
  EContractType,
  ELandType,
  ENotificationType,
  ETransactionType,
  TRequest,
  TResponse,
} from "../misc/types";

const router = Router();

router.get("/:id", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const land = await Land.findOne({
      where: { id: req.params.id },
      relations: ["owner", "continent", "capital", "shelter"],
    });

    return res.json({ status: "S", data: land });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/:id/contract", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const contract = new Contract();
    contract.to = <any>{ id: req.body.to };
    contract.coins = parseInt(req.body.coins);
    contract.expiry = req.body.expiry;
    contract.info = `land:${req.params.id}`;
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
      await postNotification({
        type: ENotificationType.CONTRACT_PENDING,
        info: [`to:${req.body.to}`, `world:${req.body.wid}`],
        handlers: [
          `user:${req.body.from}`,
          `land:${req.params.id}`,
          `contract:${contract.id}`,
        ],
      });
    } else {
      await Contract.update(
        <any>{
          id: Not(contract.id),
          status: EContractStatus.PENDING.toString(),
          land: { id: req.params.id },
        },
        <any>{ status: EContractStatus.REJECTED.toString() }
      );
    }

    return res.json({ status: "S", data: contract });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get(
  "/:id/contract/:type",
  isAuth,
  async (req: TRequest, res: TResponse) => {
    try {
      const contracts = await Contract.find({
        where: <any>{
          land: { id: req.params.id },
          type: req.params.type,
        },
        relations: ["from"],
        order: { createdAt: "DESC" },
      });

      return res.json({ status: "S", data: contracts });
    } catch (error: any) {
      console.error(error);
      return res.json({ status: "F", data: error.message });
    }
  }
);

router.delete(
  "/:id/build/cancel",
  isAuth,
  async (req: TRequest, res: TResponse) => {
    try {
      await Shelter.delete({ land: { id: req.params.id } });
      return res.json({ status: "S" });
    } catch (error: any) {
      console.error(error);
      return res.json({ status: "F", data: error.message });
    }
  }
);

router.put(
  "/:id/build/complete",
  isAuth,
  async (req: TRequest, res: TResponse) => {
    try {
      await postNotification({
        type: ENotificationType.BUILD_COMPLETION,
        info: [`to:${req.user?.id}`, `world:${req.body.wid}`],
        handlers: [`land:${req.params.id}`],
      });

      return res.json({ status: "S" });
    } catch (error: any) {
      console.error(error);
      return res.json({ status: "F", data: error.message });
    }
  }
);

router.post(
  "/:id/build/:type",
  isAuth,
  async (req: TRequest, res: TResponse) => {
    try {
      const type = parseInt(req.params.type);
      if (type === ELandType.SHELTER) {
        const shelter = new Shelter();
        shelter.value = req.body.value;
        shelter.type = req.body.type;
        shelter.paint = req.body.paint;
        shelter.built = req.body.built;
        shelter.locked = true;
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

        await postTransaction({
          from: { id: req.user?.id } as any,
          coins: shelter.value,
          type: ETransactionType.LAND_BUILD,
        });

        return res.json({ status: "S", data: shelter });
      }
      return res.json({ status: "F" });
    } catch (error: any) {
      console.error(error);
      return res.json({ status: "F", data: error.message });
    }
  }
);

export default router;
