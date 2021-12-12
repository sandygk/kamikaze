import { Application, SCALE_MODES } from 'pixi.js';
import { Input } from './Input';
import { vectorPool } from './utils/Vector';
import { Cloud } from './entities/Clouds';
import { Camera } from './entities/Camera';
import { Bullet } from './entities/Bullet';
import './style.css';
import { Spark } from './entities/Spark';
import { playerAirplane } from './entities/Airplane/PlayerAirplane';
import { EnemyAirplane } from './entities/Airplane/EnemyAirplane';

/** Pixel resolution of the game. */
export const resolution = {
  width: 640,
  height: 360,
};

// destructure the pixy.js app object
// to access its fields directly
export const {
  view, screen, stage,
  renderer, loader, ticker,
} = new Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});
export let dt = 0;

/**
Main function of the game.
Initializes the game and sets up the update loop.
*/
async function main() {
  document.body.appendChild(view);
  setTitleAndFavicon();
  handleResize();
  Input.init();
  await loadTextures();
  initScene();
  ticker.add((_dt) =>
  {
    dt = _dt /= 60;
    updateGame();
  });
}
window.onload = main;

/** Sets the title and favicon of the browser tab. */
function setTitleAndFavicon() {
  document.title = 'kamikaze';
  /* set favicon */ {
    const head = document.querySelector('head');
    const favicon = document.createElement('link');
    favicon.setAttribute('rel', 'shortcut icon');
    favicon.setAttribute('href', 'assets/favicon.ico');
    head!.appendChild(favicon);
  }
}

/** Handles the logic of resizing the renderer when the screen size changes. */
function handleResize() {
  /**
  * Resizes the renderer and centers the stage based on the current window's
  * size. The function is called at the beginning of the game and every time
  * the window is resized.
  */
  const resizeRendererAndCenterStage = () => {
    const heightRatio = window.innerHeight / resolution.height;
    const widthRatio = window.innerWidth / resolution.width;
    const scale = Math.min(heightRatio, widthRatio);
    renderer.resize(resolution.width * scale, resolution.height * scale);
    stage.scale.x = scale;
    stage.scale.y = scale;

    // place the stage pivot in the center of the screen
    stage.position.set(screen.width / 2, screen.height / 2);
  };
  resizeRendererAndCenterStage();
  window.addEventListener('resize', resizeRendererAndCenterStage);
}

/**
 Loads all the textures used in the game and
 sets the scale mode to nearest neighbor.
 */
async function loadTextures() {
  const spritePaths = [
    './assets/aircrafts.json',
    './assets/clouds.json',
    './assets/fire.json',
  ];

  /* load textures */ {
    await new Promise<void>((res) => {
      loader.add(spritePaths);
      loader.load(() => res());
    });
  }

  /* set scale mode to nearest neighbor */ {
    spritePaths.forEach((path: string) => {
      const texture = loader.resources[`${path}_image`].texture;
      if (texture) {
        texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      }
    });
  }
}

/** Initializes the game scene. */
function initScene() {
  Cloud.spawnAll();
  playerAirplane.spawn();
  EnemyAirplane.spawnAll();
}

/**
Main loop of the game. Updates all the entities
in the game each frame.
*/
function updateGame() {
  playerAirplane.update();
  EnemyAirplane.updateAll();
  Bullet.updateAll();
  Spark.updateAll();
  Camera.update();

  vectorPool.freeAll();
}
