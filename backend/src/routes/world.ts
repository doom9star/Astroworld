import { Router } from "express";
import Continent from "../entities/Continent";
import File from "../entities/File";
import Land from "../entities/Land";
import World from "../entities/World";
import isAuth from "../middlewares/isAuth";
import getResponse from "../utils/getResponse";

const router = Router();

router.post("/", isAuth, async (_, res) => {
  const world = new World();
  world.name = "oasis";
  world.area = 250 * 25 * 9;
  world.thumbnail = new File();
  world.thumbnail.url = "/images/oasis.png";
  world.thumbnail.cid = "world-oasis";

  world.continents = [];
  const names = [
    ["tokyo", "rio", "denver"],
    ["helsinki", "bogota", "nairobi"],
    ["oslo", "palermo", "berlin"],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const continent = new Continent();
      continent.name = names[i][j];
      continent.area = 250 * 25;
      continent.position = `${i} ${j}`;

      continent.lands = [];
      for (let k = 0; k < 5; k++) {
        for (let l = 0; l < 5; l++) {
          const land = new Land();
          land.area = 250;
          land.cost = 500;
          land.position = `${k} ${l}`;
          continent.lands.push(land);
        }
      }
      world.continents.push(continent);
    }
  }
  await world.save();
  return res.json(getResponse("SUCCESS", "World created successfully!", world));
});

router.get("/", isAuth, async (req, res) => {
  const worlds = await World.find({
    relations: ["thumbnail"],
  });
  return res.json(
    getResponse("SUCCESS", "Worlds retrieved successfully!", worlds)
  );
});

router.get("/:id", isAuth, async (req, res) => {
  const world = await World.findOne({
    where: { id: req.params.id },
    relations: ["thumbnail", "continents", "continents.lands"],
  });
  return res.json(
    getResponse("SUCCESS", "World retrieved successfully!", world)
  );
});

export default router;
