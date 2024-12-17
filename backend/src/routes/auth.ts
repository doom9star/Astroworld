import { Request, Router } from "express";
import postNotification from "../controllers/postNotification";
import postTransaction from "../controllers/postTransaction";
import Capital from "../entities/Capital";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import isNotAuth from "../middlewares/isNotAuth";
import { COOKIE_NAME, WEEK } from "../misc/constants";
import {
  ENotificationType,
  ETransactionType,
  TRequest,
  TResponse,
} from "../misc/types";
import getToken from "../utils/getToken";
import giftUser from "../controllers/giftUser";

const router = Router();

router.get("/", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    await giftUser(user);
    return res.json({ status: "S", data: user });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/register", isNotAuth, async (req: Request, res: TResponse) => {
  try {
    const { email, password } = req.body;

    const coins = (await Capital.getRepository().count()) * 100;
    const user = await User.create({
      email,
      password,
      coins,
    }).save();

    await Capital.getRepository().decrement({}, "reserve", 100);

    if (coins > 0) {
      await postTransaction({
        to: { id: user.id } as any,
        coins,
        type: ETransactionType.NEW_CITIZEN,
      });
      await postNotification({
        type: ENotificationType.NEW_CITIZEN,
        info: [`to:${user.id}`, `coins:${coins}`],
        handlers: [],
      });
    }

    res.cookie(COOKIE_NAME, getToken({ id: user.id }), {
      maxAge: WEEK,
    });

    return res.json({ status: "S", data: user });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.post("/login", isNotAuth, async (req: Request, res: TResponse) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { [email.includes("@") ? "email" : "name"]: email },
    });
    if (!user) return res.json({ status: "F", data: "user does not exist!" });
    if (!(await user.checkPassword(password)))
      return res.json({ status: "F", data: "wrong credentials!" });

    await giftUser(user);
    res.cookie(COOKIE_NAME, getToken({ id: user.id }), { maxAge: WEEK });

    return res.json({ status: "S", data: user });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.delete("/logout", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    res.clearCookie(COOKIE_NAME);
    return res.json({ status: "S" });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
