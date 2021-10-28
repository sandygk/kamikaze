// This file contains all the logic of the game.

import { AnimatedSprite, SCALE_MODES, Sprite, Texture } from 'pixi.js';
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
  PLAYER_FLIGHT_ACCELERATION,
  PLAYER_FLIGHT_MAX_ANGULAR_SPEED,
  PLAYER_FLIGHT_MAX_SPEED,
  PLAYER_FLIGHT_ANGULAR_ACCELERATION,
  PLAYER_FLIGHT_ANGULAR_DECELERATION,
  PLAYER_GLIDE_ACCELERATION,
} from './constants';
import './style.css';
import { DOWN, TAU } from './utils/math';

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

  // destructure app for convenience
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
  /* init sprites */{
    const spritePaths = [
      './assets/airplanes.json',
      './assets/clouds.json'
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
      const airplaneSprite = new AnimatedSprite([Texture.from('airplane')]);
      airplaneSprite.loop = true;
      airplaneSprite.animationSpeed = 0.1;
      airplaneSprite.play();
      airplaneSprite.anchor.set(0.5, 0.5);
      player.sprite = airplaneSprite;
      stage.addChild(player.sprite!);
    }
    /* init cloud sprites */ {
      for (let i = 0; i < 20000; i++) {
        const cloudSprite = new Sprite(Texture.from('cloud'));
        cloudSprite.scale.set(2.3);
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
              const angularAcceleration = inputs.accelerate ?
                PLAYER_FLIGHT_ANGULAR_ACCELERATION :
                PLAYER_GLIDE_ANGULAR_ACCELERATION;
              player.angularSpeed += rotationSign * angularAcceleration * dt;
            }
            else {
              const angularDeceleration = inputs.accelerate ?
                PLAYER_FLIGHT_ANGULAR_DECELERATION :
                PLAYER_GLIDE_ANGULAR_DECELERATION;
              const deltaRotationSpeed = Math.sign(player.angularSpeed) * angularDeceleration * dt;
              if (Math.abs(player.angularSpeed) < deltaRotationSpeed) player.angularSpeed = 0;
              else player.angularSpeed -= deltaRotationSpeed;
            }
          }
          /* clamp angular speed */ {
            const maxAngularSpeed = inputs.accelerate ?
              PLAYER_FLIGHT_MAX_ANGULAR_SPEED :
              PLAYER_GLIDE_MAX_ANGULAR_SPEED;
            if (Math.abs(player.angularSpeed) > maxAngularSpeed)
              player.angularSpeed = Math.sign(player.angularSpeed) * maxAngularSpeed;
          }
          /* update rotation*/ {
            player.rotation += player.angularSpeed * dt * TAU;
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
              .rotateTo(player.rotation)
              .multiplyScalar(inputs.accelerate ?
                PLAYER_FLIGHT_ACCELERATION :
                PLAYER_GLIDE_ACCELERATION)
              .multiplyScalar(dt);
            player.velocity.add(deltaVelocity);
          }

          /* clamp velocity*/ {
            player.velocity.clamp(PLAYER_FLIGHT_MAX_SPEED);
          }

          /* update position */ {
            const displacement = auxVector
              .copyFrom(player.velocity)
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
