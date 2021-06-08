import { AnimatedSprite } from 'pixi.js';

export type Dimensions = { width: number; height: number };

export type Point = { x: number; y: number };

export type Vector = Point;

export type Player = {
  position: Point;
  /** the direction that the player is facing */
  facingDirection: number;
  /** the direction of the motion */
  motionDirection: number;
  speed: number;
  sprite?: AnimatedSprite;
};
