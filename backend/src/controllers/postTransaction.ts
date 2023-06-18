import Transaction from "../entities/Transaction";
import User from "../entities/User";
import { ETransactionType } from "../misc/types";

type TPostArgs = {
  from?: User;
  to?: User;
  completed?: boolean;
  coins: number;
  type: ETransactionType;
};

export default async function postTransaction(args: TPostArgs) {
  const transaction = new Transaction();
  if (args.from) transaction.from = args.from;
  if (args.to) transaction.to = args.to;
  if (typeof args.completed !== "undefined")
    transaction.completed = args.completed;
  transaction.coins = args.coins;
  transaction.type = args.type;
  await transaction.save();
}
