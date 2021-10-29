// This file contains all the types of the game.

import { AnimatedSprite } from 'pixi.js';
import { Vector2D } from './utils/Vector';

/** Defines all the players' data*/
export type Player = {
  /** Speed at which the player is rotating. */
  angularSpeed: number;
  /** Angle of rotation of the player. */
  rotation: number;
  /** The velocity at which the player is moving. */
  readonly velocity: Vector2D;
  /** The position of the player. */
  readonly position: Vector2D;
  /** The sprite of the player. */
  sprite?: AnimatedSprite;
};
