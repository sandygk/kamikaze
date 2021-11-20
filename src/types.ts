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
  angularAcceleration: number,
  /** Angular deceleration. */
  angularDeceleration: number,
  /** Maximum angular speed. */
  maxAngularSpeed: number,

  /** Acceleration.*/
  acceleration: number,
  /** Max speed. */
  maxSpeed: number,
  /** Deceleration force to simulate drag. */
  deceleration: number,

  /** Full health amount. */
  fullHealth: number,
  /** Amount of damage the airplane causes on impact. */
  damageOnImpact: number,
}

/** Parameters of a bullet. */
export type BulletParams = {
  /** The speed at which the bullet moves. */
  speed: number,
  /** Amount of damage bullet cause on impact*/
  damageOnImpact: number,
}

/** Parameters of a weapon. */
export type WeaponParams = {
  /** Time to wait between shots. */
  fireCooldownTime: number,
  /** Bullets direction is randomized within the spread angle. */
  spreadAngle: number,
}

/** Parameters of the enemy weapon. */
export type EnemyWeaponParams = WeaponParams & {
  /** Maximum distance from the player for the enemy to start shooting */
  maxShootingDistance: number,
}
