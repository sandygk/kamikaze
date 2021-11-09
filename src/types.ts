// This file contains all the types of the game.

import { AnimatedSprite, Sprite } from 'pixi.js';
import { Vector2D } from './utils/Vector';

/** Contains the data for the player*/
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
  /** Time stamp of the last bullet shot by the player. */
  lastBulletTimestamp: number;
};

/** Class to represent the bullet objects in the game*/
export type Bullet = {
  /** Direction in which the bullet is moving */
  direction: number
  /** Position of the bullet */
  position: Vector2D;
  /** Sprite used to render the bullet */
  sprite?: Sprite;
}
