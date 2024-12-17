import { Router } from "express";
import { In, Like } from "typeorm";
import Notification from "../entities/Notification";
import isAuth from "../middlewares/isAuth";
import { TRequest, TResponse } from "../misc/types";

const router = Router();

router.get("/", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const notifications = await Notification.find({
      where: { info: Like(`%to:${req.user?.id}%`) },
      order: { createdAt: "DESC" },
    });
    return res.json({ status: "S", data: notifications });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/read", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const nids = req.body.nids;
    await Notification.update(
      {
        id: In(nids),
      },
      { read: true }
    );
    return res.json({ status: "S" });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
