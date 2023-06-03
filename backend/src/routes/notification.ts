import { Router } from "express";
import { Like } from "typeorm";
import Notification from "../entities/Notification";
import isAuth from "../middlewares/isAuth";
import { TAuthRequest } from "../misc/types";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/", isAuth, async (req: TAuthRequest, res) => {
  const notifications = await Notification.find({
    where: { info: Like(`%${req.user?.id}%`) },
    order: { createdAt: "DESC" },
  });
  return res.json(
    getResponse(
      "SUCCESS",
      "Notifications retrieved successfully!",
      notifications
    )
  );
});

export default router;
