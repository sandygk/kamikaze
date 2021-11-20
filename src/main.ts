// This file contains all the logic of the game.

import { AnimatedSprite, SCALE_MODES, Sprite, Texture } from 'pixi.js';
import {
  app,
  bulletPool,
  camera,
  enemyPool,
  inputs,
  player,
  resolution,
} from './state';
import { playerParams, cameraParams, playerWeaponParams, playerBulletsParams, enemyParams, enemyBulletsParams, enemyWeaponParams } from './params';
import './style.css';
import { PI, TAU } from './utils/math';
import { Vector2D, vectorPool } from './utils/Vector';
import { Airplane, AirplaneParams, Bullet } from './types';

// destructure app instance for convenience
const {
  view, screen, stage,
  renderer, loader, ticker,
} = app;

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
      if (key === ' ') inputs.fire = pressed;
    };
    window.addEventListener('keydown', (event: any) => {
      setInputState(event.key, true);
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      setInputState(event.key, false);
    });
  }
  /* load sprites */{
    const spritePaths = [
      './assets/aircrafts.json',
      './assets/clouds.json',
      './assets/fire.json',
    ];
    /* load textures*/ {
      await new Promise<void>((res) => {
        loader.add(spritePaths);
        loader.load(() => res());
      });
    }
    /* set scale mode to nearest neighbor*/ {
      spritePaths.forEach((path: string) => {
        const texture = loader.resources[`${path}_image`].texture;
        if (texture) {
          texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        }
      });
    }
  }
  /* init scene */{
    /* init player */ {
      /* init sprite */{
        player.sprite = new AnimatedSprite([Texture.from('falcon')]);
        player.sprite.loop = true;
        player.sprite.play();
        player.sprite.anchor.set(0.5, 0.5);
      }
      stage.addChild(player.sprite!);
    }
    /* init clouds */ {
      for (let i = 0; i < 20000; i++) {
        const cloudIndex = Math.floor(Math.random() * 6);
        const cloud = new Sprite(Texture.from(`cloud-${cloudIndex}`));
        cloud.position.set(
          (Math.random() - 0.5) * resolution.height * 80,
          (Math.random() - 0.5) * resolution.width * 80
        );
        stage.addChild(cloud);
      }
    }
    /* init enemies */ {
      for (let i = 0; i < 10; i++) {
        enemyPool.get(() => {

          let position: Vector2D;
          /* compute initial position */ {
            position = new Vector2D()
              .fromAngle(Math.random() * TAU)
              .multiplyScalar(600);
          }
          let sprite: AnimatedSprite;
          /* init sprite */ {
            sprite = new AnimatedSprite([Texture.from('hawk')]);
            sprite.anchor.set(0.5, 0.5);
            sprite.position.set(position.x, position.y);
            stage.addChild(sprite);
          }
          return {
            angularSpeed: 0,
            rotation: Math.random() * TAU,
            velocity: new Vector2D(),
            position,
            sprite,
            lastBulletTimestamp: 0,
            health: enemyParams.fullHealth,
          }
        });
      }
    }
  }
  /* update loop */ {
    ticker.add((dt) => {
      vectorPool.freeAll();
      dt /= 60;
      /* player */ {

        /* compute rotation sign */
        let rotationSign; {
          rotationSign = 0
          if (inputs.turnClockwise) rotationSign += 1;
          if (inputs.turnCounterclockwise) rotationSign -= 1;
        }
        /* fire bullets */ {
          if (inputs.fire) attemptToFire(player, false);
        }
        updateAirplane(player, playerParams, rotationSign, dt);
      }
      /* enemies */ {
        enemyPool.startIteration()
        let enemy: Airplane | null;
        while (enemy = enemyPool.next()) {
          /* compute rotation sign */
          let rotationSign: number; {
            const currentDirection = vectorPool
              .fromAngle(enemy.rotation);
            const directionTowardsPlayer = vectorPool
              .copy(enemy.position)
              .directionTo(player.position);
            rotationSign = currentDirection.angleTo(directionTowardsPlayer);
            if (Math.abs(rotationSign) < PI / 20) rotationSign = 0;
          }
          /* update position */ {
            updateAirplane(enemy, enemyParams, rotationSign, dt);
          }
          /* attempt to fire */ {
            if (
              enemy.position.distance(player.position) < enemyWeaponParams.maxShootingDistance
            ) {
              attemptToFire(enemy, true);
            }
          }
        }
      }
      /* bullets */ {

        /* update bullets */ {
          bulletPool.startIteration();
          let bullet: Bullet | null;
          while (bullet = bulletPool.next()) {
            /* update position */ {
              const bulletParams = bullet.isEnemyBullet ? enemyBulletsParams : playerBulletsParams;
              const displacement = vectorPool
                .fromAngle(bullet.direction)
                .multiplyScalar(dt * bulletParams.speed);
              bullet.position.add(displacement);
            }
            /* update sprite */ {
              bullet.sprite!.rotation = bullet.direction;
              bullet.sprite!.position.set(bullet.position.x, bullet.position.y);
            }
          }
        }
      }
      /* camera */ {
        // average the enemy positions
        enemyPool.startIteration();
        let enemiesInRangeCount = 0;
        let enemy;
        const enemiesInRangeAvgPosition = vectorPool.new();
        while (enemy = enemyPool.next()) {
          enemiesInRangeAvgPosition.add(enemy.position)
          enemiesInRangeCount++;
        }
        enemiesInRangeAvgPosition.divideScalar(enemiesInRangeCount);

        // average the average enemy position with the players position in time ahead seconds
        const targetPosition = vectorPool
          .copy(player.velocity)
          .multiplyScalar(cameraParams.timeAhead)
          .add(player.position)
        if (enemiesInRangeCount > 0)
          targetPosition
            .add(enemiesInRangeAvgPosition)
            .divideScalar(2);
        camera.position.copy(player.position)
          .moveToward(targetPosition, cameraParams.maxDistanceFromPlayer);
        camera.position.toObservablePoint(stage.pivot);
      }
    });
  }
};

/**
Updates the rotation, position and sprite of the given airplane.
@param airplane The airplane to update.
@param params The airplane parameters to use.
@param rotationSign The sign of the rotation, `0` to not rotate,
`> 0` to rotate clockwise, and `< 0` to rotate counterclockwise.
@param dt The delta time from the previous tick of the main loop.
*/
function updateAirplane(airplane: Airplane, params: AirplaneParams, rotationSign: number, dt: number) {
  /* update rotation */ {
    /* accelerate/decelerate rotation */ {
      if (rotationSign) {
        airplane.angularSpeed += rotationSign * params.angularAcceleration * dt;
      }
      else {
        const deltaRotationSpeed = Math.sign(airplane.angularSpeed) * params.angularDeceleration * dt;
        if (Math.abs(airplane.angularSpeed) < deltaRotationSpeed) airplane.angularSpeed = 0;
        else airplane.angularSpeed -= deltaRotationSpeed;
      }
    }
    /* clamp angular speed */ {
      if (Math.abs(airplane.angularSpeed) > params.maxAngularSpeed)
        airplane.angularSpeed = Math.sign(airplane.angularSpeed) * params.maxAngularSpeed;
    }
    /* update rotation*/ {
      airplane.rotation += airplane.angularSpeed * dt * TAU;
    }
  }
  /* update position */ {
    /* decelerate (apply drag force) */ {
      const deltaVelocity = params.deceleration * dt;
      if (Math.abs(airplane.velocity.x) <= deltaVelocity) airplane.velocity.x = 0;
      else airplane.velocity.x += -Math.sign(airplane.velocity.x) * deltaVelocity;
      if (Math.abs(airplane.velocity.y) <= deltaVelocity) airplane.velocity.y = 0;
      else airplane.velocity.y += -Math.sign(airplane.velocity.y) * deltaVelocity;
    }

    /* accelerate (apply engine force)*/ {
      const deltaVelocity = vectorPool
        .fromAngle(airplane.rotation)
        .multiplyScalar(params.acceleration * dt)

      airplane.velocity
        .add(deltaVelocity)
        .clamp(params.maxSpeed)
    }

    /* update position */ {
      const displacement = vectorPool
        .copy(airplane.velocity)
        .multiplyScalar(dt)
      airplane.position.add(displacement);
    }
  }
  /* update sprite */ {
    airplane.sprite!.rotation = airplane.rotation;
    airplane.sprite!.position.set(airplane.position.x, airplane.position.y);
  }
}

/**
Attempts to fire a bullet from the given airplane. The bullet
will be fired unless the cooldown time hasn't been completed yet.
@param airplane The airplane that shots the bullet
@param isEnemyAirplane Whether the airplane is an enemy airplane or not
*/
function attemptToFire(airplane: Airplane, isEnemyAirplane: boolean) {
  const bulletParams = isEnemyAirplane ? enemyBulletsParams : playerBulletsParams;
  const weaponParams = isEnemyAirplane ? enemyWeaponParams : playerWeaponParams;
  const spriteName = isEnemyAirplane ? 'round-fire-with-border' : 'round-fire-no-border';
  if (Date.now() - airplane.lastBulletTimestamp > weaponParams.fireCooldownTime) {
    airplane.lastBulletTimestamp = Date.now();
    bulletPool.get(() => {
      let sprite: Sprite
      /* init sprite */ {
        sprite = new Sprite(Texture.from(spriteName));
        sprite.anchor.set(0.5, 0.5);
        stage.addChild(sprite);
      }
      return {
        direction: airplane.rotation
          + Math.random() * weaponParams.spreadAngle
          - weaponParams.spreadAngle / 2,
        position: new Vector2D().copy(airplane.position),
        sprite,
        damageOnImpact: bulletParams.damageOnImpact,
        isEnemyBullet: isEnemyAirplane,
      }
    });
  }
}
