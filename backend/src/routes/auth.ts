import { Router } from "express";

import Capital from "../entities/Capital";
import Notification from "../entities/Notification";
import Transaction from "../entities/Transaction";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import isNotAuth from "../middlewares/isNotAuth";
import { COOKIE_NAME, WEEK } from "../misc/constants";
import {
  ENotificationType,
  ETransactionType,
  TAuthRequest,
} from "../misc/types";
import getResponse from "../utils/getResponse";
import getToken from "../utils/getToken";

const router = Router();

router.get("/", isAuth, async (req: TAuthRequest, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    return res.json(
      getResponse("SUCCESS", "Authenticated User returned!", user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.post("/register", isNotAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const coins = (await Capital.getRepository().count()) * 100;
    const user = await User.create({
      email,
      password,
      coins,
    }).save();

    await Capital.getRepository().decrement({}, "reserve", 100);

    const transaction = new Transaction();
    transaction.to = <any>{ id: user.id };
    transaction.coins = coins;
    transaction.type = ETransactionType.USER_JOIN;
    await transaction.save();

    const notification = new Notification();
    notification.handlers = [];
    notification.info = {
      user: user.id,
      coins,
    };
    notification.type = ENotificationType.USER_JOIN;
    await notification.save();

    res.cookie(COOKIE_NAME, getToken({ id: user.id }), {
      maxAge: WEEK,
    });
    return res.json(
      getResponse("SUCCESS", `User has registered successfully!`, user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.post("/login", isNotAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { [email.includes("@") ? "email" : "name"]: email },
    });

    if (!user) return res.json(getResponse("ERROR", "User does not exist!"));
    if (!(await user.checkPassword(password)))
      return res.json(getResponse("ERROR", "Wrong credentials!"));

    res.cookie(COOKIE_NAME, getToken({ id: user.id }), { maxAge: WEEK });
    return res.json(
      getResponse("SUCCESS", `User has logged in successfully!`, user)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.delete("/logout", isAuth, async (_, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json(getResponse("SUCCESS", "User logged out successfully!"));
});

export default router;
