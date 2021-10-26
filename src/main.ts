// This file contains all the logic of the game.

import { AnimatedSprite, Loader, SCALE_MODES, Sprite, Texture } from 'pixi.js';
import {
  app,
  auxVector,
  camera,
  cloudSprites,
  inputs,
  player,
  resolution,
} from './state';
import {
  PLAYER_DECELERATION,
  PLAYER_GLIDE_MAX_ANGULAR_SPEED,
  PLAYER_GLIDE_ANGULAR_ACCELERATION,
  PLAYER_GLIDE_ANGULAR_DECELERATION,
  PLAYER_TURBO_ACCELERATION,
  PLAYER_TURBO_MAX_ANGULAR_SPEED,
  PLAYER_TURBO_MAX_SPEED,
  PLAYER_TURBO_ANGULAR_ACCELERATION,
  PLAYER_TURBO_ANGULAR_DECELERATION,
  PLAYER_GLIDE_ACCELERATION,
} from './constants';
import './style.css';
import { DOWN, TAU } from './utils/math';

window.onload = async () => {
  // destructure app for convenience
  const {
    view, screen, stage,
    renderer, loader, ticker,
  } = app;

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
      if (key === 'ArrowUp') inputs.turbo = pressed;
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
      const airplanesPath = './assets/airplanes.json';
      const cloudsPath = './assets/clouds.json';
      /* setup loader*/ {
        loader.add([airplanesPath, cloudsPath]);
        loader.onComplete.once(() => { res(); });
        loader.onError.once(() => { rej(); });
      }
      loader.load(() => {
        /* set scale mode to nearest*/{
          const setScaleModeToNearest = (loader: Loader, path: string) => {
            const texture = loader.resources[`${path}_image`].texture;
            if (texture) {
              texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            }
          };
          setScaleModeToNearest(loader, airplanesPath);
          setScaleModeToNearest(loader, cloudsPath);
        }
        /* init player sprite */ {
          const airplaneSprite = new AnimatedSprite([Texture.from('airplane')]);
          airplaneSprite.loop = true;
          airplaneSprite.animationSpeed = 0.1;
          airplaneSprite.play();
          airplaneSprite.scale.set(3);
          airplaneSprite.anchor.set(0.5, 0.5);
          player.sprite = airplaneSprite;
          stage.addChild(player.sprite!);
        }
        /* init cloud sprites */ {
          for (let i = 0; i < 20000; i++) {
            const cloudSprite = new Sprite(Texture.from('cloud'));
            cloudSprite.scale.set(5);
            cloudSprite.alpha = 0.7;
            cloudSprites.push(cloudSprite);
            cloudSprite.position.set(
              (Math.random() - 0.5) * resolution.height * 80,
              (Math.random() - 0.5) * resolution.width * 80
            );
            stage.addChild(cloudSprite);
          }
        }
      });
    });
  }
  /* update loop */ {
    ticker.add((dt) => {
      dt /= 60;
      /* update player */ {
        /* update rotation */ {
          /* compute input rotation sign */
          let inputRotationSign; {
            inputRotationSign = 0
            if (inputs.turnClockwise) inputRotationSign += 1;
            if (inputs.turnCounterclockwise) inputRotationSign -= 1;
          }
          /* accelerate/decelerate rotation */ {
            if (inputRotationSign) {
              const rotationAcceleration = inputs.turbo ?
                PLAYER_TURBO_ANGULAR_ACCELERATION :
                PLAYER_GLIDE_ANGULAR_ACCELERATION;
              player.angularSpeed += inputRotationSign * rotationAcceleration * dt;
            }
            else {
              const rotationDeceleration = inputs.turbo ?
                PLAYER_TURBO_ANGULAR_DECELERATION :
                PLAYER_GLIDE_ANGULAR_DECELERATION;
              const deltaRotationSpeed = Math.sign(player.angularSpeed) * rotationDeceleration * dt;
              if (Math.abs(player.angularSpeed) < deltaRotationSpeed) player.angularSpeed = 0;
              else player.angularSpeed -= deltaRotationSpeed;
            }
          }
          /* clamp rotation speed */ {
            const maxRotationSpeed = inputs.turbo ?
              PLAYER_TURBO_MAX_ANGULAR_SPEED :
              PLAYER_GLIDE_MAX_ANGULAR_SPEED;
            if (Math.abs(player.angularSpeed) > maxRotationSpeed)
              player.angularSpeed = Math.sign(player.angularSpeed) * maxRotationSpeed;
          }
          /* update direction*/ {
            player.direction += player.angularSpeed * dt * TAU;
          }
        }
        /* update position */ {
          /* decelerate velocity (apply drag) */ {
            const deltaVelocity = PLAYER_DECELERATION * dt;
            if (Math.abs(player.velocity.x) <= deltaVelocity) player.velocity.x = 0;
            else player.velocity.x += -Math.sign(player.velocity.x) * deltaVelocity;
            if (Math.abs(player.velocity.y) <= deltaVelocity) player.velocity.y = 0;
            else player.velocity.y += -Math.sign(player.velocity.y) * deltaVelocity;
          }

          /* accelerate velocity */ {
            const deltaVelocity = auxVector
              .setToUp()
              .rotateTo(player.direction)
              .multiplyScalar(inputs.turbo ?
                PLAYER_TURBO_ACCELERATION :
                PLAYER_GLIDE_ACCELERATION)
              .multiplyScalar(dt);
            player.velocity.add(deltaVelocity);
          }

          /* clamp velocity*/ {
            player.velocity.clamp(PLAYER_TURBO_MAX_SPEED);
          }

          /* update position */ {
            const displacement = auxVector
              .copyFrom(player.velocity)
              .multiplyScalar(dt)
            player.position.add(displacement);
          }
        }
        /* update sprite */ {
          player.sprite!.rotation = player.direction + DOWN;
          player.sprite!.position.set(player.position.x, player.position.y);
        }
      }
      /* update camera */ {
        //const target = auxVector
        //  .setToRight()
        //  .rotateTo(player.direction)
        //  .multiplyScalar(400)
        //  .add(player.position);

        ////Linearly interpolate camera.position with target:
        ////formula: A*t + B*(1 - t)
        //const t = 0.07;
        //const scaledTarget = target.multiplyScalar(t);
        //camera.position
        //  .multiplyScalar(1 - t)
        //  .add(scaledTarget)

        camera.position.copyFrom(player.position)
        camera.position.toObservablePoint(stage.pivot);
      }
    });
  }
};
