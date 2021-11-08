// This file contains all the global constant values of the game.

/** Constant values relative to the player*/
export const PLAYER = {
  /** Player's angular acceleration when flighting */
  ANGULAR_ACCELERATION : 2 ,
  /** Player's angular deceleration when flighting */
  ANGULAR_DECELERATION : 5 ,
  /** Player's maximum angular speed when flighting */
  MAX_ANGULAR_SPEED : .7 ,

  /** Player's acceleration when flighting */
  ACCELERATION : 900 ,
  /** Player's max speed when flighting */
  MAX_SPEED : 400 ,
  /** Player's deceleration */
  DECELERATION : 250 ,
}

/** Constant values relative to the camera*/
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
