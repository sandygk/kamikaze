// This file contains the parameters values of the game.

import { AirplaneParams, BulletParams, EnemyWeaponParams, WeaponParams } from "./types"

/** Parameter values of the player. */
export const PLAYER: AirplaneParams = {
  ANGULAR_ACCELERATION: 2,
  ANGULAR_DECELERATION: 5,
  MAX_ANGULAR_SPEED: .7,
  ACCELERATION: 800,
  MAX_SPEED: 300,
  DECELERATION: 250,
  FULL_HEALTH: 100,
  DAMAGE_ON_IMPACT: 50,
}

/** Parameter values of the enemies. */
export const ENEMIES: AirplaneParams = {
  ANGULAR_ACCELERATION: 100,
  ANGULAR_DECELERATION: 100,
  MAX_ANGULAR_SPEED: .4,
  ACCELERATION: 500,
  MAX_SPEED: 400,
  DECELERATION: 250,
  FULL_HEALTH: 100,
  DAMAGE_ON_IMPACT: 50,
}

/** Parameters of the player weapon. */
export const PLAYER_WEAPON: WeaponParams = {
  FIRE_COOLDOWN_TIME: 150,
}

/** Parameters of the enemy weapon. */
export const ENEMY_WEAPON: EnemyWeaponParams = {
  FIRE_COOLDOWN_TIME: 4000,
  MAX_SHOOTING_DISTANCE: 300,
}

/** Parameters of the enemy bullets. */
export const PLAYER_BULLETS: BulletParams = {
  SPEED: 700,
  DAMAGE_ON_IMPACT: 50,
}

/** Parameters of the enemy bullets. */
export const ENEMY_BULLETS: BulletParams = {
  SPEED: 450,
  DAMAGE_ON_IMPACT: 50,
}


/** Parameter values of the camera. */
export const CAMERA = {
  /**
  How far ahead in time (seconds) the camera will project the
  player to find its target. The camera computes where
  the the player will be after the time ahead passes
  based on the current player velocity and looks
  at that position to give the player a better view
  of what's coming.
  */
  TIME_AHEAD: 1 / 7,
}
