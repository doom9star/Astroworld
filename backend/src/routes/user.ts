import { Router } from "express";
import { Like } from "typeorm";
import File from "../entities/File";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import { TRequest, TResponse } from "../misc/types";

const router = Router();

router.get("/avatar", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    const avatars = await File.find({
      where: { cid: Like(`%avatar%`) },
      select: { id: true, url: true, cid: true },
    });
    return res.json({ status: "S", data: avatars });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.put("/", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    await User.update(req.user!.id, {
      ...req.body,
      ...(req.body.avatar
        ? { avatar: { id: req.body.avatar } }
        : { avatar: null }),
    });
    return res.json({ status: "S" });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get("/user/:uid", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.uid },
      relations: ["avatar"],
    });
    return res.json({ status: "S", data: user });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
