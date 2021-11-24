// This file contains all the logic of the game.

import { Application, SCALE_MODES } from 'pixi.js';
import { setInputState } from './input';
import { vectorPool } from './utils/Vector';
import { initPlayerAirplane, updatePlayerAirplane } from './entities/Airplane/PlayerAirplane';
import { initEnemyAirplanes, updateEnemyAirplanes } from './entities/Airplane/EnemyAirplane';
import { initClouds } from './entities/Cloud';
import { updateCamera } from './entities/Camera';
import { updateBullets } from './entities/Bullet';
import './style.css';

/** Pixel resolution of the game. */
export const resolution = {
  width: 640,
  height: 360,
};

export const {
  view, screen, stage,
  renderer, loader, ticker,
} = new Application({
  backgroundColor: 0x63ace8,
  width: resolution.width,
  height: resolution.height,
  antialias: false,
});

window.onload = async () => {
  document.body.appendChild(view);
  setTitleAndFavicon();
  handleResize();
  handleInput();
  await loadSprites();
  initScene();
  ticker.add((dt) => updateGame(dt));
};

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

function handleResize() {
  const handleResize = () => {
    const heightRatio = window.innerHeight / resolution.height;
    const widthRatio = window.innerWidth / resolution.width;
    const scale = Math.min(heightRatio, widthRatio);
    renderer.resize(resolution.width * scale, resolution.height * scale);
    stage.scale.x = scale;
    stage.scale.y = scale;

    // place the stage pivot in the center of the screen
    stage.position.set(screen.width / 2, screen.height / 2);
  };
  handleResize();
  window.addEventListener('resize', handleResize);
}

function handleInput() {
  window.addEventListener('keydown', (event: any) => {
    setInputState(event.key, true);
  });
  window.addEventListener('keyup', (event: KeyboardEvent) => {
    setInputState(event.key, false);
  });
}

async function loadSprites() {
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

function initScene() {
  initClouds();
  initPlayerAirplane();
  initEnemyAirplanes();
}

function updateGame(dt: number) {
  vectorPool.freeAll();
  dt /= 60;

  updatePlayerAirplane(dt);
  updateEnemyAirplanes(dt);
  updateBullets(dt);
  updateCamera(dt);
}
