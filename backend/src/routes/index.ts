import { Router } from "express";

import AuthRouter from "./auth";
import UserRouter from "./user";
import WorldRouter from "./world";
import LandRouter from "./land";
import ContractRouter from "./contract";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/world", WorldRouter);
router.use("/land", LandRouter);
router.use("/contract", ContractRouter);

router.get("/", async (req, res) => {
  res.send(`Hi I'm ${req.path}, welcome to ASTROWORLD API.`);
});

export default router;
