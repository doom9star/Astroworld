import { Router } from "express";
import Contract from "../entities/Contract";
import isAuth from "../middlewares/isAuth";
import getResponse from "../utils/getResponse";

const router = Router();

router.get("/:id", isAuth, async (req, res) => {
  const contract = await Contract.findOne({
    where: { id: req.params.id },
    relations: ["from", "to"],
  });
  return res.json(
    getResponse("SUCCESS", "Contract retrieved successfully!", contract)
  );
});

export default router;
