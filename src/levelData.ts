import p5, { Image } from "p5";
import { spaceTypes } from "./spaceTypes";

let S = spaceTypes.SAFE;
let B = spaceTypes.ZUBAT_SPAWN;
let N = spaceTypes.NOISY;
let W = spaceTypes.WATER;
let E = spaceTypes.EMPTY;
let T = spaceTypes.TRAINER_SPAWN;

export class levelData{
  levelImagePath: string;
  spaces: spaceTypes[][];
  xOffset: number;
  yOffset: number;
  sprite: Image;

  constructor(
    levelImagePath: string, 
    spaces: spaceTypes[][],
    xOffset: number,
    yOffset: number
    ){
      this.levelImagePath = levelImagePath;
      this.spaces = spaces;
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.sprite = new Image(1,1);
    }

    loadSprite(p: p5){
      this.sprite = p.loadImage(this.levelImagePath);
    }
}

export let level1: spaceTypes[][] = [
  [S, B, N, N, W, W, W, N],
  [N, E, E, N, N, N, W, N],
  [N, N, N, N, N, E, E, N],
  [W, E, W, E, W, E, E, N],
  [N, E, N, E, N, N, W, N],
  [N, N, N, N, N, N, W, T],
];

export let level1Data: levelData = new levelData(
  '/assests/Level1.png',
  level1,
  40,
  74
)

export let level2: spaceTypes[][] = [
  [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, ],
  [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, ],
  [E, E, E, E, E, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, E, E, E, E, E, ],
  [E, E, E, E, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, E, E, E, E, ],
  [E, E, E, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, E, E, E, ],
  [E, E, N, N, S, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, S, N, N, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, N, N, N, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, N, N, N, E, E, ],
  [E, E, N, N, N, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, N, N, N, E, E, ],
  [E, E, N, N, N, N, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, N, N, N, N, E, E, ],
  [E, E, N, N, N, N, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, N, N, N, N, E, E, ],
  [E, E, E, E, E, E, E, E, E, E, E, E, E, E, W, W, E, E, E, E, E, E, E, E, E, E, E, E, E, E, ],
  [E, E, E, E, E, E, E, E, E, E, E, E, E, E, W, W, E, E, E, E, E, E, E, E, E, E, E, E, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, W, W, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, W, W, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, W, W, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, N, T, N, N, N, N, N, N, N, N, N, N, W, W, N, N, N, N, N, N, N, N, N, N, T, N, E, E, ],
  [E, E, N, N, N, N, N, N, N, N, N, N, N, N, W, W, N, N, N, N, N, N, N, N, N, N, N, N, E, E, ],
  [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, ],
];