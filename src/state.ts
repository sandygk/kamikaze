// This file contains all the global state of the game.

import { Application } from 'pixi.js';
import { PLAYER } from './params';
import { Bullet, Airplane } from './types';
import { UP } from './utils/math';
import { Vector2D } from './utils/Vector';
import { EntityPool } from './utils/EntityPool';

/** Pixel resolution of the game. */
export const resolution = {
  width: 640,
  height: 360,
};

/** Pixi.js app instance. */
export const app = new Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});

/** Stores the input values for the current frame. */
export const inputs = {
  turnCounterclockwise: false,
  turnClockwise: false,
  fire: false,
};

/** Player instance. */
export const player: Airplane = {
  position: new Vector2D(),
  angularSpeed: 0,
  rotation: UP,
  velocity: new Vector2D().setToUp().multiplyScalar(PLAYER.MAX_SPEED),
  lastBulletTimestamp: 0,
  health: 100,
};

/** Stores the information of the camera. */
export const camera = {
  position: new Vector2D(),
};

/** Pool to manage the memory of the bullet entities. */
export const bulletPool = new EntityPool<Bullet>();

/** Pool to manage the memory of the enemy entities. */
export const enemyPool = new EntityPool<Airplane>();
