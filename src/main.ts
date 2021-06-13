import { AnimatedSprite, Loader, SCALE_MODES, Sprite, Texture } from 'pixi.js';
import {
  app,
  auxVector,
  camera,
  cloudSprites,
  inputs,
  player,
  PLAYER_ROTATION_SPEED,
  resolution,
} from './state';
import './style.css';
import { DOWN, TAU } from './utils/math';

window.onload = async (): Promise<void> => {
  document.body.appendChild(app.view);
  /* handle screen resize */ {
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
  }
  /* handle input */ {
    const setInputState = (key: string, pressed: boolean) => {
      if (key === 'ArrowLeft') inputs.turnCounterclockwise = pressed;
      if (key === 'ArrowRight') inputs.turnClockwise = pressed;
      if (key === 'ArrowUp') inputs.accelerate = pressed;
      if (key === 'Space') inputs.fire = pressed;
    };
    window.addEventListener('keydown', (event: any) => {
      setInputState(event.key, true);
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      setInputState(event.key, false);
    });
  }
  /* load and place sprites */ {
    await new Promise<void>((res, rej) => {
      const loader = Loader.shared;
      const airplanesPath = './assets/airplanes.json';
      const cloudsPath = './assets/clouds.json';
      loader.add([airplanesPath, cloudsPath]);
      loader.onComplete.once(() => {
        res();
      });
      loader.onError.once(() => {
        rej();
      });
      loader.load(() => {
        const setScaleModeToNearest = (loader: Loader, path: string) => {
          const texture = loader.resources[`${path}_image`].texture;
          if (texture) {
            texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
          }
        };
        setScaleModeToNearest(loader, airplanesPath);
        setScaleModeToNearest(loader, cloudsPath);

        /* init player sprite */ {
          const airplaneSprite = new AnimatedSprite([Texture.from('airplane')]);
          airplaneSprite.loop = true;
          airplaneSprite.animationSpeed = 0.1;
          airplaneSprite.play();
          airplaneSprite.scale.set(5);
          airplaneSprite.anchor.set(0.5, 0.5);
          player.sprite = airplaneSprite;
          app.stage.addChild(player.sprite!);
        }
        /* init cloud sprites */ {
          for (let i = 0; i < 10000; i++) {
            const cloudSprite = new Sprite(Texture.from('cloud'));
            cloudSprite.scale.set(5);
            cloudSprite.alpha = 0.7;
            cloudSprites.push(cloudSprite);
            cloudSprite.position.set(
              (Math.random() - 0.5) * resolution.height * 80,
              (Math.random() - 0.5) * resolution.width * 80
            );
            app.stage.addChild(cloudSprite);
          }
        }
      });
    });
  }
  /* update loop */ {
    app.ticker.add((delta) => {
      delta /= 60;
      /* update player */ {
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
      }
      /* update camera */ {
        camera.position.copyFrom(player.position);
        app.stage.pivot.set(player.position.x, player.position.y);
      }
    });
  }
};
