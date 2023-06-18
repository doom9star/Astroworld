import User from "../entities/User";
import { WEEK } from "../misc/constants";
import { ETransactionType } from "../misc/types";
import postTransaction from "./postTransaction";

export default async function giftUser(user: User | null) {
  if (
    user &&
    Math.floor(new Date().getTime() - user.loginGift.getTime()) > WEEK / 7
  ) {
    user.loginGift = new Date();
    await user.save();
    await postTransaction({
      to: user,
      coins: 10,
      completed: false,
      type: ETransactionType.LOGIN_GIFT,
    });
  }
}
