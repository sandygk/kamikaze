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
  /** Angular acceleration. */
  ANGULAR_ACCELERATION: number,
  /** Angular deceleration. */
  ANGULAR_DECELERATION: number,
  /** Maximum angular speed. */
  MAX_ANGULAR_SPEED: number,

  /** Acceleration.*/
  ACCELERATION: number,
  /** Max speed. */
  MAX_SPEED: number,
  /** Deceleration force to simulate drag. */
  DECELERATION: number,

  /** Full health amount. */
  FULL_HEALTH: number,
  /** Amount of damage the airplane causes on impact. */
  DAMAGE_ON_IMPACT: number,
}

/** Parameters of a bullet. */
export type BulletParams = {
  /** The speed at which the bullet moves. */
  SPEED: number,
  /** Amount of damage bullet cause on impact*/
  DAMAGE_ON_IMPACT: number,
}

/** Parameters of a weapon. */
export type WeaponParams = {
  /** Time to wait between shots. */
  FIRE_COOLDOWN_TIME: number,
  /** Bullets direction is randomized within the spread angle. */
  SPREAD_ANGLE: number,
}

/** Parameters of the enemy weapon. */
export type EnemyWeaponParams = WeaponParams & {
  /** Maximum distance from the player for the enemy to start shooting */
  MAX_SHOOTING_DISTANCE: number,
}
