import { Application, Sprite } from 'pixi.js';
import { Dimensions, Player } from './types';
import { UP } from './utils/math';
import { Vector } from './utils/Vector';

export const resolution: Dimensions = {
  width: 1920,
  height: 1080,
};

export const app = new Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});

export const inputs = {
  turnCounterclockwise: false,
  turnClockwise: false,
  turbo: false,
  fire: false,
};


export const PLAYER_GLIDE_ANGULAR_ACCELERATION = 5;
export const PLAYER_GLIDE_ANGULAR_DECELERATION = 2;
export const PLAYER_GLIDE_MAX_ANGULAR_SPEED = 1.1;

export const PLAYER_TURBO_ANGULAR_ACCELERATION = 2;
export const PLAYER_TURBO_ANGULAR_DECELERATION = 5;
export const PLAYER_TURBO_MAX_ANGULAR_SPEED = .3;

export const PLAYER_GLIDE_ACCELERATION = 1;
export const PLAYER_GLIDE_MAX_SPEED = 600;

export const PLAYER_TURBO_ACCELERATION = 1000;
export const PLAYER_TURBO_MAX_SPEED = 1300;

export const PLAYER_DECELERATION = 300;


export const player: Player = {
  position: new Vector(),
  angularSpeed: 0,
  direction: UP,
  velocity: new Vector().setToUp().multiplyScalar(PLAYER_GLIDE_MAX_SPEED),
};

export const camera = {
  position: new Vector(),
};

/** Auxiliary vector for update computations to avoid generating memory garbage */
export const auxVector = new Vector();

export const cloudSprites: Sprite[] = [];
