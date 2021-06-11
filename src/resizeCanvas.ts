import { app, resolution } from './store';

export const resizeCanvas = (): void => {
  const handleResize = () => {
    const heightRatio = window.innerHeight / resolution.height;
    const widthRatio = window.innerWidth / resolution.width;
    const scale = Math.min(heightRatio, widthRatio);
    app.renderer.resize(resolution.width * scale, resolution.height * scale);
    app.stage.scale.x = scale;
    app.stage.scale.y = scale;

    // place the stage pivot in the center of the screen
    app.stage.position.set(app.screen.width / 2, app.screen.height / 2);
  };
  handleResize();
  window.addEventListener('resize', handleResize);
};
