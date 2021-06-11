import {
  app,
  auxVector,
  camera,
  cloudSprites,
  inputs,
  player,
  PLAYER_ROTATION_SPEED,
  resolution,
} from './store';
import { DOWN, TAU } from './utils/math';

const init = () => {
  app.stage.addChild(player.sprite!);
  cloudSprites.forEach((cloudSprite) => {
    cloudSprite.position.set(
      Math.random() * 10000 - 500,
      Math.random() * 10000 - 500
    );
    app.stage.addChild(cloudSprite);
    console.log(cloudSprite);
  });
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
  const displacement = auxVector
    .setToRight()
    .rotateTo(player.motionDirection)
    .multiplyScalar(player.speed * delta);
  player.position.add(displacement);

  //update sprite
  player.sprite!.rotation = player.facingDirection + DOWN;
  player.sprite!.position.set(player.position.x, player.position.y);

  //update camera
  camera.position.copyFrom(player.position);
  app.stage.position.set(
    -(camera.position.x - resolution.width / 2),
    -(camera.position.y - resolution.height / 2)
  );
};
