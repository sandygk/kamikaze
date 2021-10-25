// This file contains all the global state of the game.

import { Application, Sprite } from 'pixi.js';
import { Player } from './types';
import { UP } from './utils/math';
import { Vector } from './utils/Vector';
import { PLAYER_GLIDE_MAX_SPEED } from './constants';

/** Pixel resolution of the game*/
export const resolution = {
  width: 1920,
  height: 1080,
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
  turbo: false,
  fire: false,
};

/** Player instance */
export const player: Player = {
  position: new Vector(),
  angularSpeed: 0,
  direction: UP,
  velocity: new Vector().setToUp().multiplyScalar(PLAYER_GLIDE_MAX_SPEED),
};

/** Stores the information of the camera */
export const camera = {
  position: new Vector(),
};

/** Auxiliary vector for update computations to avoid generating memory garbage */
export const auxVector = new Vector();

/** Array to store all instances of the cloud sprites */
export const cloudSprites: Sprite[] = [];
