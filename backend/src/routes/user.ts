import { Router } from "express";
import File from "../entities/File";
import User from "../entities/User";
import isAuth from "../middlewares/isAuth";
import { EFileType, TAuthRequest } from "../misc/types";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/avatar", isAuth, async (_, res) => {
  try {
    const avatars = await File.find({
      where: { type: EFileType.AVATAR },
      select: { id: true, url: true, cid: true },
    });
    return res.json(
      getResponse("SUCCESS", "Avatars retrieved successfully!", avatars)
    );
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

router.put("/", isAuth, async (req: TAuthRequest, res) => {
  try {
    await User.update(req.user!.id, { ...req.body });
    return res.json(getResponse("SUCCESS", "User updated successfully!"));
  } catch (error: any) {
    console.error(error);
    return res.json(getResponse("ERROR", error.message));
  }
});

export default router;
