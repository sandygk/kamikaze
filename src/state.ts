// This file contains all the global state of the game.

import { Application, Sprite } from 'pixi.js';
import { PLAYER_MAX_SPEED } from './constants';
import { Player } from './types';
import { UP } from './utils/math';
import { Vector2D } from './utils/Vector';

/** Pixel resolution of the game*/
export const resolution = {
  width: 640,
  height: 360,
};

/** Pixi.js app instance*/
export const app = new Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});

/** Stores the input values for the current frame*/
export const inputs = {
  turnCounterclockwise: false,
  turnClockwise: false,
  fire: false,
};

/** Player instance */
export const player: Player = {
  position: new Vector2D(),
  angularSpeed: 0,
  rotation: UP,
  velocity: new Vector2D().setToUp().multiplyScalar(PLAYER_MAX_SPEED),
};

/** Stores the information of the camera */
export const camera = {
  position: new Vector2D(),
};

/** Array to store all instances of the cloud sprites */
export const cloudSprites: Sprite[] = [];
