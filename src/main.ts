import { Application, SCALE_MODES } from 'pixi.js';
import { setInputState } from './input';
import { vectorPool } from './utils/Vector';
import { addPlayerAirplane, updatePlayerAirplane } from './entities/Airplane/PlayerAirplane';
import { addInitialEnemyAirplanes, updateEnemyAirplanes } from './entities/Airplane/EnemyAirplane';
import { addClouds } from './entities/Cloud';
import { updateCamera } from './entities/Camera';
import { updateBullets } from './entities/Bullet';
import './style.css';

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

/**
Main function of the game.
Initializes the game and sets up the update loop.
*/
async function main() {
  document.body.appendChild(view);
  setTitleAndFavicon();
  handleResize();
  handleInput();
  await loadTextures();
  initScene();
  ticker.add((dt) => updateGame(dt));
}
window.onload = main;

/** Sets the title and favicon of the browser tab. */
function setTitleAndFavicon() {
  document.title = 'kamikaze';
  /* set favicon */ {
    const head = document.querySelector('head');
    const favicon = document.createElement('link');
    favicon.setAttribute('rel', 'shortcut icon');
    favicon.setAttribute('href', 'playerAirplaneassets/favicon.ico');
    head!.appendChild(favicon);
  }
}

/** Handles the logic of resizing the renderer when the screen size changes. */
function handleResize() {
  /**
  * Updates the renderer and stage based on the current window's size.
  * The function is called at the beginning of the game and every time
  * the window is resized.
  */
  const updateRendererAndStage = () => {
    const heightRatio = window.innerHeight / resolution.height;
    const widthRatio = window.innerWidth / resolution.width;
    const scale = Math.min(heightRatio, widthRatio);
    renderer.resize(resolution.width * scale, resolution.height * scale);
    stage.scale.x = scale;
    stage.scale.y = scale;

    // place the stage pivot in the center of the screen
    stage.position.set(screen.width / 2, screen.height / 2);
  };
  updateRendererAndStage();
  window.addEventListener('resize', updateRendererAndStage);
}

/**
Handles the input by updating the `input` state every time
a key is pressed or released.
*/
function handleInput() {
  window.addEventListener('keydown', (event: any) => {
    setInputState(event.key, true);
  });
  window.addEventListener('keyup', (event: KeyboardEvent) => {
    setInputState(event.key, false);
  });
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
  addClouds();
  addPlayerAirplane();
  addInitialEnemyAirplanes();
}

/**
Main loop of the game. Updates all the entities
in the game each frame.
*/
function updateGame(dt: number) {
  vectorPool.freeAll();
  dt /= 60;

  updatePlayerAirplane(dt);
  updateEnemyAirplanes(dt);
  updateBullets(dt);
  updateCamera();
}
