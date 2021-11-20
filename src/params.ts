// This file contains the parameters values of the game.

import { AirplaneParams, BulletParams, EnemyWeaponParams, WeaponParams } from "./types"
import { PI } from "./utils/math"

/** Parameter values of the player. */
export const playerParams: AirplaneParams = {
  angularAcceleration: 2,
  angularDeceleration: 5,
  maxAngularSpeed: .8,
  acceleration: 800,
  maxSpeed: 300,
  deceleration: 250,
  fullHealth: 100,
  damageOnImpact: 50,
}

/** Parameter values of the enemies. */
export const enemyParams: AirplaneParams = {
  angularAcceleration: 100,
  angularDeceleration: 100,
  maxAngularSpeed: .4,
  acceleration: 500,
  maxSpeed: 400,
  deceleration: 250,
  fullHealth: 100,
  damageOnImpact: 50,
}

/** Parameters for the sparks. */
export const sparkParams = {
  /** Lifetime of a spark in seconds. */
  lifetime: 1,
}

/** Parameters of the player weapon. */
export const playerWeaponParams: WeaponParams = {
  fireCooldownTime: 150,
  spreadAngle: PI / 20,
}

/** Parameters of the enemy weapon. */
export const enemyWeaponParams: EnemyWeaponParams = {
  spreadAngle: PI / 10,
  fireCooldownTime: 4000,
  maxShootingDistance: 300,
}

/** Parameters of the enemy bullets. */
export const playerBulletsParams: BulletParams = {
  speed: 700,
  damageOnImpact: 50,
}

/** Parameters of the enemy bullets. */
export const enemyBulletsParams: BulletParams = {
  speed: 450,
  damageOnImpact: 50,
}


/** Parameter values of the camera. */
export const cameraParams = {
  /**
  How far ahead in time (seconds) the camera will project the
  player to find its target. The camera computes where
  the the player will be after the time ahead passes
  based on the current player velocity and looks
  at that position to give the player a better view
  of what's coming.
  */
  timeAhead: 1 / 7,
  /** Maximum distance the camera's target can be from the player*/
  maxDistanceFromPlayer: 80,
}
