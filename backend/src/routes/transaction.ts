import { Router } from "express";
import Transaction from "../entities/Transaction";
import isAuth from "../middlewares/isAuth";
import { TRequest, TResponse } from "../misc/types";

const router = Router();

router.get("/", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    const transactions = await Transaction.find({
      relations: ["from", "to"],
      order: { createdAt: "DESC" },
    });
    return res.json({ status: "S", data: transactions });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
