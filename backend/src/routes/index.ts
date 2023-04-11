import { Router } from "express";

import AuthRouter from "./auth";
import UserRouter from "./user";
import WorldRouter from "./world";
import LandRouter from "./land";
import ContractRouter from "./contract";
import NotificationRouter from "./notification";
import TransactionRouter from "./transaction";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/world", WorldRouter);
router.use("/land", LandRouter);
router.use("/contract", ContractRouter);
router.use("/notification", NotificationRouter);
router.use("/transaction", TransactionRouter);

router.get("/", async (req, res) => {
  res.send(`Hi I'm ${req.path}, welcome to ASTROWORLD API.`);
});

export default router;
