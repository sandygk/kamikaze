import { Application, SCALE_MODES } from 'pixi.js';
import { Input } from './Input';
import { vectorPool } from './utils/Vector';
import { Cloud } from './Clouds';
import { Camera } from './Camera';
import { Bullet } from './Bullet';
import './style.css';
import { Spark } from './Spark';
import { playerAirplane } from './Airplane/PlayerAirplane';
import { EnemyAirplane } from './Airplane/EnemyAirplane';

/** Handle the general logic of the game */
export class Game {

  /** Pixel resolution of the game. */
  static resolution = {
    width: 640,
    height: 360,
  };

  /** Pixi.js app instance. */
  static app = new Application({
    backgroundColor: 0x63ace8,
    width: Game.resolution.width,
    height: Game.resolution.height,
    antialias: false,
  });
  /** Pixi.js app's view. */
  static view = Game.app.view;
  /** Pixi.js app's screen. */
  static screen = Game.app.screen;
  /** Pixi.js app's stage. */
  static stage = Game.app.stage;
  /** Pixi.js app's renderer. */
  static renderer = Game.app.renderer;
  /** Pixi.js app's loader. */
  static loader = Game.app.loader;
  /** Pixi.js app's ticker. */
  static ticker = Game.app.ticker;
  /** Delta time between current and previous frame. */
  static dt = 0;

  /**
  Initializes the game and sets up the update loop.
  */
  static async init() {
    document.body.appendChild(Game.view);
    Game.setTitleAndFavicon();
    Game.handleResize();
    Input.init();
    await Game.loadTextures();
    Game.initScene();
    Game.ticker.add((_dt) => {
      Game.dt = _dt /= 60;
      Game.update();
    });
  }

  /** Sets the title and favicon of the browser tab. */
  static setTitleAndFavicon() {
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
  static handleResize() {
    /**
    * Resizes the renderer and centers the stage based on the current window's
    * size. The function is called at the beginning of the game and every time
    * the window is resized.
    */
    const resizeRendererAndCenterStage = () => {
      const heightRatio = window.innerHeight / Game.resolution.height;
      const widthRatio = window.innerWidth / Game.resolution.width;
      const scale = Math.min(heightRatio, widthRatio);
      Game.renderer.resize(Game.resolution.width * scale, Game.resolution.height * scale);
      Game.stage.scale.x = scale;
      Game.stage.scale.y = scale;

      // place the stage pivot in the center of the screen
      Game.stage.position.set(screen.width / 2, screen.height / 2);
    };
    resizeRendererAndCenterStage();
    window.addEventListener('resize', resizeRendererAndCenterStage);
  }

  /**
  Loads all the textures used in the game and
  sets the scale mode to nearest neighbor.
  */
  static async loadTextures() {
    const spritePaths = [
      './assets/aircrafts.json',
      './assets/clouds.json',
      './assets/fire.json',
    ];

    /* load textures */ {
      await new Promise<void>((res) => {
        Game.loader.add(spritePaths);
        Game.loader.load(() => res());
      });
    }

    /* set scale mode to nearest neighbor */ {
      spritePaths.forEach((path: string) => {
        const texture = Game.loader.resources[`${path}_image`].texture;
        if (texture) {
          texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        }
      });
    }
  }

  /** Initializes the game scene. */
  static initScene() {
    Cloud.spawnAll();
    playerAirplane.spawn();
    EnemyAirplane.spawnAll();
  }

  /**
  Main loop of the game. Updates all the entities
  in the game each frame.
  */
  static update() {
    playerAirplane.update();
    EnemyAirplane.updateAll();
    Bullet.updateAll();
    Spark.updateAll();
    Camera.update();

    vectorPool.freeAll();
  }
}
