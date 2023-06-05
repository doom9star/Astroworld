import { Router } from "express";
import Capital from "../entities/Capital";
import Continent from "../entities/Continent";
import Land from "../entities/Land";
import World from "../entities/World";
import isAuth from "../middlewares/isAuth";
import { ELandType, TRequest, TResponse } from "../misc/types";

const router = Router();

router.post("/", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const world = new World();
    world.name = "oasis";
    world.area = 250 * 25 * 9;

    world.continents = [];
    const names = [
      ["tokyo:1000", "rio:16000", "denver:500"],
      ["helsinki:8000", "bogota:32000", "nairobi:4000"],
      ["oslo:250", "palermo:2000", "berlin:125"],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const [name, value] = names[i][j].split(":");
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
              land.capital.locked = false;
              land.capital.operating = true;
              land.capital.reserve = 100 * 25 * 9;
              land.type = ELandType.CAPITAL;
              land.available = false;
            }

            continent.lands.push(land);
          }
        }
        world.continents.push(continent);
      }
    }

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
        land.available = false;
      }
    }

    await world.save();

    return res.json({ status: "S", data: world });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get("/", isAuth, async (_: TRequest, res: TResponse) => {
  try {
    const worlds = await World.find({});
    return res.json({ status: "S", data: worlds });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

router.get("/:id", isAuth, async (req: TRequest, res: TResponse) => {
  try {
    const world = await World.findOne({
      where: {
        id: req.params.id,
      },
      relations: [
        "continents",
        "continents.lands",
        "continents.lands.owner",
        "continents.lands.contracts",
        "continents.lands.contracts.from",
        "continents.lands.contracts.to",
        "continents.lands.capital",
        "continents.lands.shelter",
      ],
      order: { continents: { position: "ASC", lands: { position: "ASC" } } },
    });

    return res.json({ status: "S", data: world });
  } catch (error: any) {
    console.error(error);
    return res.json({ status: "F", data: error.message });
  }
});

export default router;
