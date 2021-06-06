import { AnimatedSprite, Application } from 'pixi.js';
import { Dimensions } from './types';

export const sprites: { plane?: AnimatedSprite } = {};

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
  turnLeft: false,
  turnRight: false,
  moveForward: false,
  fire: false,
};
