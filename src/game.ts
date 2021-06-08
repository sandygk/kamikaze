import { app, auxVector, inputs, player, PLAYER_ROTATION_SPEED } from './store';
import math from './utils/math';
import * as vector from './utils/vector';
import { add, multiplyScalar, rotate, setToRight } from './utils/vector';

const init = () => {
  app.stage.addChild(player.sprite!);
};

const update = (delta: number) => {
  updatePlayer(delta / 60);
};

export default {
  init,
  update,
};

function updatePlayer(delta: number) {
  //update rotation
  let rotationDirection = 0;
  if (inputs.turnCounterclockwise) rotationDirection -= 1;
  if (inputs.turnClockwise) rotationDirection += 1;
  player.rotation +=
    rotationDirection * math.TAU * PLAYER_ROTATION_SPEED * delta;

  //update position
  const displacement = auxVector;
  setToRight(displacement);
  rotate(displacement, player.rotation);
  multiplyScalar(displacement, player.speed * delta);
  add(player.position, displacement);

  //update sprite
  player.sprite!.rotation = player.rotation + Math.PI / 2;
  player.sprite!.position.set(player.position.x, player.position.y);
}
