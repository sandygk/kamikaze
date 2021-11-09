// This file contains the parameters values of the game.

import { AirplaneParams } from "./types"

/** Parameter values of the player. */
export const PLAYER : AirplaneParams = {
  ANGULAR_ACCELERATION : 2,
  ANGULAR_DECELERATION : 5 ,
  MAX_ANGULAR_SPEED : .7,
  ACCELERATION : 900,
  MAX_SPEED : 400,
  DECELERATION : 250,
  FULL_HEALTH: 100,
  DAMAGE_ON_IMPACT: 50,
}

/** Parameter values of the enemies. */
export const ENEMIES : AirplaneParams = {
  ANGULAR_ACCELERATION : 2,
  ANGULAR_DECELERATION : 5 ,
  MAX_ANGULAR_SPEED : .7,
  ACCELERATION : 900,
  MAX_SPEED : 400,
  DECELERATION : 250,
  FULL_HEALTH: 100,
  DAMAGE_ON_IMPACT: 50,
}

/** Parameter values of the weapon.  */
export const WEAPONS = {
  /** Time to wait between shots. */
  FIRE_COOLDOWN_TIME: 200,
}

export const BULLETS = {
  /** The speed at which the bullet moves. */
  SPEED: 800,
  /** Amount of damage bullet cause on impact*/
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
  TIME_AHEAD : 1 / 7,
}
