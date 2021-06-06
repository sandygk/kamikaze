import { app, inputs, resolution, sprites } from './store';

const init = () => {
  const plane = sprites.plane!;
  plane.position.set(resolution.width / 2, resolution.height / 2);
  app.stage.addChild(plane);
};

const update = (delta: number) => {
  let direction = 0;
  if (inputs.turnLeft) direction += 1;
  if (inputs.turnRight) direction -= 1;
  sprites.plane!.rotation -= direction * 0.06 * delta;
};

export default {
  init,
  update,
};
