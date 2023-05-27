import { Router } from "express";
import { v4 } from "uuid";
import Capital from "../entities/Capital";
import Continent from "../entities/Continent";
import File from "../entities/File";
import Land from "../entities/Land";
import World from "../entities/World";
import isAuth from "../middlewares/isAuth";
import { ELandType, TAuthRequest } from "../misc/types";
import getResponse from "../utils/getResponse";

const router = Router();

router.post("/", isAuth, async (req: TAuthRequest, res) => {
  const world = new World();
  world.name = "oasis";
  world.area = 250 * 25 * 9;
  world.thumbnail = new File();
  world.thumbnail.url = "/images/oasis.png";
  world.thumbnail.cid = "world-oasis";

  world.continents = [];
  const names = [
    ["tokyo|1000", "rio|16000", "denver|500"],
    ["helsinki|8000", "bogota|32000", "nairobi|4000"],
    ["oslo|250", "palermo|2000", "berlin|125"],
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const [name, value] = names[i][j].split("|");
      const continent = new Continent();
      continent.name = name;
      continent.area = 250 * 25;
      continent.position = `${i} ${j}`;

      continent.lands = [];
      for (let k = 0; k < 5; k++) {
        for (let l = 0; l < 5; l++) {
          const land = new Land();
          land.area = 250;
          land.value = parseInt(value);
          land.position = `${k} ${l}`;
          land.owner = <any>{ id: req.user?.id };
          land.available = true;

          if (continent.position === "1 1" && land.position === "2 2") {
            land.value = 100000;
            land.capital = new Capital();
            land.capital.reserve = 100 * 25 * 9;
            land.capital.locked = false;
            land.capital.operating = true;
            land.capital.thumbnail = new File();
            land.capital.thumbnail.url = "/images/houses/3/blue.png";
            land.capital.thumbnail.cid = "capital-oasis";
            land.type = ELandType.CAPITAL;
            land.available = false;
          }

          continent.lands.push(land);
        }
      }
      world.continents.push(continent);
    }
  }

  // const rivers = {
  //   4: ["2 1", "3 1", "3 2", "3 3", "2 3"],
  //   6: ["2 3", "2 4", "3 3", "3 4"],
  //   5: ["4 2", "4 3"],
  //   8: ["0 2", "0 3"],
  // };
  // for (const [c, l] of Object.entries(rivers)) {
  //   const continent = world.continents[parseInt(c)];
  //   for (const _l of l) {
  //     const land = continent.lands.find((l) => l.position === _l) as Land;
  //     land.thumbnail = new File();
  //     land.thumbnail.cid = `decoration-${v4()}`;
  //     land.thumbnail.url = "/images/decorations/river.jpg";
  //   }
  // }

  const grass = {
    0: ["0 0", "0 1", "0 2", "1 1"],
    1: ["1 4", "2 4", "3 4", "3 3"],
    2: ["2 0", "2 1", "3 0", "3 1"],
    4: ["1 1", "1 2", "1 3", "2 1", "3 1", "3 2", "3 3", "2 3"],
    6: ["1 3", "1 4"],
    8: ["2 0", "3 2", "1 2"],
  };
  for (const [c, l] of Object.entries(grass)) {
    const continent = world.continents[parseInt(c)];
    for (const _l of l) {
      const land = continent.lands.find((l) => l.position === _l) as Land;
      land.type = ELandType.DECORATION;
      land.thumbnail = new File();
      land.thumbnail.cid = `decoration-${v4()}`;
      land.thumbnail.url = `/images/decorations/grass2.png`;
      land.available = false;
    }
  }

  await world.save();

  return res.json(getResponse("SUCCESS", "World created successfully!", world));
});

router.get("/", isAuth, async (_, res) => {
  const worlds = await World.find({
    relations: ["thumbnail"],
  });
  return res.json(
    getResponse("SUCCESS", "Worlds retrieved successfully!", worlds)
  );
});

router.get("/:id", isAuth, async (req, res) => {
  const world = (await World.findOne({
    where: {
      id: req.params.id,
    },
    relations: [
      "thumbnail",
      "continents",
      "continents.lands",
      "continents.lands.owner",
      "continents.lands.thumbnail",
      "continents.lands.contracts",
      "continents.lands.contracts.from",
      "continents.lands.contracts.to",
      "continents.lands.capital",
      "continents.lands.capital.thumbnail",
      "continents.lands.shelter",
      "continents.lands.shelter.thumbnail",
    ],
    order: { continents: { position: "ASC", lands: { position: "ASC" } } },
  })) as World;
  return res.json(
    getResponse("SUCCESS", "World retrieved successfully!", world)
  );
});

export default router;
