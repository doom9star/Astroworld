import Notification from "../entities/Notification";
import { ENotificationType } from "../misc/types";

type TPostArgs = {
  type: ENotificationType;
  info: any[];
  handlers: any[];
};

export default async function postNotification(args: TPostArgs) {
  const notification = new Notification();
  notification.type = args.type;
  notification.info = args.info;
  notification.handlers = args.handlers;
  await notification.save();
}
