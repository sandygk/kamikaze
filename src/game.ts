import { app, auxVector, inputs, player, PLAYER_ROTATION_SPEED } from './store';
import { DOWN, TAU } from './utils/math';
import { add, multiplyScalar, rotateTo, setToRight } from './utils/vector';

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

const updatePlayer = (delta: number) => {
  //update facingDirection
  let sign = 0;
  if (inputs.turnCounterclockwise) sign -= 1;
  if (inputs.turnClockwise) sign += 1;
  player.facingDirection += sign * TAU * PLAYER_ROTATION_SPEED * delta;

  //update motionDirection
  if (inputs.accelerate) player.motionDirection = player.facingDirection;

  //update position
  const displacement = auxVector;
  setToRight(displacement);
  rotateTo(displacement, player.motionDirection);
  multiplyScalar(displacement, player.speed * delta);
  add(player.position, displacement);

  //update sprite
  player.sprite!.rotation = player.facingDirection + DOWN;
  player.sprite!.position.set(player.position.x, player.position.y);
};
