import { AnimatedSprite } from 'pixi.js';
import { Vector } from './utils/Vector';

export type Dimensions = { width: number; height: number };

export type Player = {
  position: Vector;
  /** the direction that the player is facing */
  facingDirection: number;
  /** the direction of the motion */
  motionDirection: number;
  speed: number;
  sprite?: AnimatedSprite;
};
