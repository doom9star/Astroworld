import { Router } from "express";
import Transaction from "../entities/Transaction";
import isAuth from "../middlewares/isAuth";
import { ETransactionType, TRequest, TResponse } from "../misc/types";
import User from "../entities/User";

const router = Router();

router.get("/", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    const transactions = await Transaction.find({
      where: { completed: true },
      relations: ["from", "to"],
      order: { createdAt: "DESC" },
    });
    return res.json({ status: "S", data: transactions });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get("/gift", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const gifts = await Transaction.find({
      where: <any>{
        to: { id: req.user?.id },
        type: ETransactionType.LOGIN_GIFT.toString(),
      },
      order: { createdAt: "DESC" },
    });
    return res.json({ status: "S", data: gifts });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.put("/:id/complete", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    if (transaction) {
      transaction.completed = true;
      await transaction.save();
      await req.db
        ?.getRepository(User)
        .increment({ id: req.user?.id }, "coins", 10);
    }
    return res.json({ status: "S" });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
