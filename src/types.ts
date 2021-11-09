// This file contains all the types of the game.

import { AnimatedSprite, Sprite } from 'pixi.js';
import { Vector2D } from './utils/Vector';

/** Contains the data for an airplane instance. */
export type Airplane = {
  /** Speed at which the airplane is rotating. */
  angularSpeed: number;
  /** Angle of rotation of the airplane. */
  rotation: number;
  /** The velocity at which the airplane is moving. */
  readonly velocity: Vector2D;
  /** The position of the airplane. */
  readonly position: Vector2D;
  /** The sprite of the airplane. */
  sprite?: AnimatedSprite;
  /** Time stamp of the last bullet shot by the airplane. */
  lastBulletTimestamp: number;
  /** Current health of the airplane. */
  health: number;
  /** Amount of damage the airplane causes on impact. */
  damageOnImpact: number;
};

/** Class to represent the bullet objects in the. game*/
export type Bullet = {
  /** Direction in which the bullet is moving. */
  direction: number
  /** Position of the bullet. */
  position: Vector2D;
  /** Sprite used to render the bullet. */
  sprite?: Sprite;
  /** Amount of damage the bullet causes on impact. */
  damageOnImpact: number;
  /** Whether the bullet was shot by an enemy or the player*/
  isEnemyBullet: boolean;
}


/** Parameters of an airplane */
export type AirplaneParams = {
  /** Angular acceleration when flighting. */
  ANGULAR_ACCELERATION : 2,
  /** Angular deceleration when flighting. */
  ANGULAR_DECELERATION : 5 ,
  /** Maximum angular speed when flighting. */
  MAX_ANGULAR_SPEED : .7,

  /** Acceleration when flighting. */
  ACCELERATION : 900,
  /** Max speed when flighting. */
  MAX_SPEED : 400,
  /** Deceleration force to simulate drag. */
  DECELERATION : 250,

  /** Full health amount. */
  FULL_HEALTH: 100,
  /** Amount of damage airplanes causes on impact. */
  DAMAGE_ON_IMPACT : 50,
}
