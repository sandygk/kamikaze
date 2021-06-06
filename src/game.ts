import { app, resolution, sprites } from "./store";

const init = () => {
  const plane = sprites.plane!;
  plane.position.set(resolution.width / 2, resolution.height / 2);
  app.stage.addChild(plane);
};

const update = (delta: number) => {
  sprites.plane!.rotation -= 0.01 * delta;
};

export default {
  init,
  update,
};
