// This file contains all the logic of the game.

import { AnimatedSprite, SCALE_MODES, Sprite, Texture } from 'pixi.js';
import {
  app,
  camera,
  cloudSprites,
  inputs,
  player,
  resolution,
} from './state';
import {PLAYER, CAMERA} from './constants';
import './style.css';
import { DOWN, TAU } from './utils/math';
import { vectorPool } from './utils/Vector';

window.onload = async () => {
  /* set title and favicon*/ {
    document.title = 'kamikaze';

    //set favicon
    const head = document.querySelector('head');
    const favicon = document.createElement('link');
    favicon.setAttribute('rel', 'shortcut icon');
    favicon.setAttribute('href', './assets/favicon.ico');
    head!.appendChild(favicon);
  }

  // destructure app instance for convenience
  const {
    view, screen, stage,
    renderer, loader, ticker,
  } = app;

  // add pixi.js view to the body
  document.body.appendChild(view);

  /* handle screen resize */ {
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
  /* handle input */ {
    const setInputState = (key: string, pressed: boolean) => {
      if (key === 'ArrowLeft') inputs.turnCounterclockwise = pressed;
      if (key === 'ArrowRight') inputs.turnClockwise = pressed;
      if (key === 'Space') inputs.fire = pressed;
    };
    window.addEventListener('keydown', (event: any) => {
      setInputState(event.key, true);
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      setInputState(event.key, false);
    });
  }
  /* init sprites */{
    const spritePaths = [
      './assets/aircrafts.json',
      './assets/clouds.json',
    ];
    /* load textures*/ {
      await new Promise<void>((res) => {
        loader.add(spritePaths);
        loader.load(() => res());
      });
    }
    /* set scale mode to nearest*/ {
      spritePaths.forEach((path: string) => {
        const texture = loader.resources[`${path}_image`].texture;
        if (texture) {
          texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        }
      });
    }
    /* init player sprite */ {
      const airplaneSprite = new AnimatedSprite([Texture.from('falcon')]);
      airplaneSprite.loop = true;
      airplaneSprite.animationSpeed = 0.1;
      airplaneSprite.play();
      airplaneSprite.anchor.set(0.5, 0.5);
      player.sprite = airplaneSprite;
      stage.addChild(player.sprite!);
    }
    /* init cloud sprites */ {
      for (let i = 0; i < 20000; i++) {
        const cloudIndex = Math.floor(Math.random() * 7);
        const cloudSprite = new Sprite(Texture.from(`cloud-${cloudIndex}`));
        cloudSprite.alpha = 0.7;
        cloudSprites.push(cloudSprite);
        cloudSprite.position.set(
          (Math.random() - 0.5) * resolution.height * 80,
          (Math.random() - 0.5) * resolution.width * 80
        );
        stage.addChild(cloudSprite);
      }
    }
  }
  /* update loop */ {
    ticker.add((dt) => {
      vectorPool.clear();
      dt /= 60;
      /* update player */ {
        /* update rotation */ {
          /* compute input rotation sign */
          let rotationSign; {
            rotationSign = 0
            if (inputs.turnClockwise) rotationSign += 1;
            if (inputs.turnCounterclockwise) rotationSign -= 1;
          }
          /* accelerate/decelerate rotation */ {
            if (rotationSign) {
              player.angularSpeed += rotationSign * PLAYER.ANGULAR_ACCELERATION * dt;
            }
            else {
              const deltaRotationSpeed = Math.sign(player.angularSpeed) * PLAYER.ANGULAR_DECELERATION * dt;
              if (Math.abs(player.angularSpeed) < deltaRotationSpeed) player.angularSpeed = 0;
              else player.angularSpeed -= deltaRotationSpeed;
            }
          }
          /* clamp angular speed */ {
            if (Math.abs(player.angularSpeed) > PLAYER.MAX_ANGULAR_SPEED)
              player.angularSpeed = Math.sign(player.angularSpeed) * PLAYER.MAX_ANGULAR_SPEED;
          }
          /* update rotation*/ {
            player.rotation += player.angularSpeed * dt * TAU;
          }
        }
        /* update position */ {
          /* decelerate (apply drag force) */ {
            const deltaVelocity = PLAYER.DECELERATION * dt;
            if (Math.abs(player.velocity.x) <= deltaVelocity) player.velocity.x = 0;
            else player.velocity.x += -Math.sign(player.velocity.x) * deltaVelocity;
            if (Math.abs(player.velocity.y) <= deltaVelocity) player.velocity.y = 0;
            else player.velocity.y += -Math.sign(player.velocity.y) * deltaVelocity;
          }

          /* accelerate (apply engine force)*/ {
            const deltaVelocity = vectorPool
              .fromAngle(player.rotation)
              .multiplyScalar(PLAYER.ACCELERATION * dt)

            player.velocity
              .add(deltaVelocity)
              .clamp(PLAYER.MAX_SPEED)
          }

          /* update position */ {
            const displacement = vectorPool
              .copy(player.velocity)
              .multiplyScalar(dt)
            player.position.add(displacement);
          }
        }
        /* update sprite */ {
          // NOTE: Adding DOWN because the airplane sprites are facing
          // UP instead of RIGHT, so we need to account for that.
          player.sprite!.rotation = player.rotation + DOWN;
          player.sprite!.position.set(player.position.x, player.position.y);
        }
      }
      /* update camera */ {
        // set the camera position to where the player will be
        // after CAMERA_TIME_AHEAD seconds, based on the player
        // current velocity
        camera.position
          .copy(player.velocity)
          .multiplyScalar(CAMERA.TIME_AHEAD)
          .add(player.position);
        camera.position.toObservablePoint(stage.pivot);
      }
    });
  }
};
