import { AnimatedSprite } from "pixi.js";

export type Dimensions = { width: number; height: number };

export type Point = {x: number, y: number};

export type Vector = Point;

export type Player = {
  position: Point;
  rotation: number;
  speed: number;
  sprite?: AnimatedSprite;
};
