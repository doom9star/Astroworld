import { Router } from "express";
import Transaction from "../entities/Transaction";
import isAuth from "../middlewares/isAuth";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/", isAuth, async (req, res) => {
  const transactions = await Transaction.find({
    relations: ["contract", "contract.from", "contract.to"],
    order: { createdAt: "DESC" },
  });
  return res.json(
    getResponse("SUCCESS", "Transactions retrieved successfully!", transactions)
  );
});

export default router;
