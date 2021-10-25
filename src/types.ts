// This file contains all the types of the game.

import { AnimatedSprite } from 'pixi.js';
import { Vector } from './utils/Vector';

/** Defines all the players' data*/
export type Player = {
  /** Speed at which the player is rotating. */
  angularSpeed: number;
  /** The direction that the player is facing. */
  direction: number;
  /** The velocity at which the player is moving. */
  readonly velocity: Vector;
  /** Current position of the player. */
  readonly position: Vector;
  /** The sprite of the player. */
  sprite?: AnimatedSprite;
};
