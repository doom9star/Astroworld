import { Router } from "express";

import AuthRouter from "./auth";
import UserRouter from "./user";
import WorldRouter from "./world";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/world", WorldRouter);

router.get("/", async (req, res) => {
  res.send(`Hi I'm ${req.path}, welcome to ASTROWORLD API.`);
});

export default router;
