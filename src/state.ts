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
  accelerate: false,
  fire: false,
};

export const PLAYER_MIN_SPEED = 600;
export const PLAYER_MAX_SPEED = 10;
export const PLAYER_ACCELERATION = 4;
export const PLAYER_DECELERATION = 2;
export const PLAYER_ROTATION_ACCELERATION = 4;
export const PLAYER_ROTATION_DECELERATION = 2;
export const PLAYER_MAX_ROTATION_SPEED = 1;



export const player: Player = {
  position: new Vector(),
  rotationSpeed: 0,
  facingDirection: UP,
  motionDirection: UP,
  speed: PLAYER_MIN_SPEED,
};

export const camera = {
  position: new Vector(),
};

/** Auxiliary vector for update computations to avoid generating memory garbage */
export const auxVector = new Vector();

export const cloudSprites: Sprite[] = [];
