// This file contains all the global constant values of the game.

/** Player's angular acceleration when flighting */
export const PLAYER_ANGULAR_ACCELERATION = 2;
/** Player's angular deceleration when flighting */
export const PLAYER_ANGULAR_DECELERATION = 5;
/** Player's maximum angular speed when flighting */
export const PLAYER_MAX_ANGULAR_SPEED = .7;

/** Player's acceleration when flighting */
export const PLAYER_ACCELERATION = 900;
/** Player's max speed when flighting */
export const PLAYER_MAX_SPEED = 400;
/** Player's deceleration */
export const PLAYER_DECELERATION = 250;

/**
How far ahead in time (seconds) the camera will project the
player to find its target. The camera computes where
the the player will be after the time ahead passes
based on the current player velocity and looks
at that position to give the player a better view
of what's coming.
*/
export const CAMERA_TIME_AHEAD = 1 / 7;
/**
Linear interpolation weight for the camera to
move towards its target
*/
export const CAMERA_LERP_WEIGHT = 0.5;
