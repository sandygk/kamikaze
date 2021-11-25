import { Airplane, AirplaneParams, updateAirplane } from "./index"
import { EntityPool } from "../../utils/EntityPool"
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Texture } from "@pixi/core";
import { stage } from "../../main";
import { PI, TAU } from "../../utils/math";
import { vectorPool } from "../../utils/Vector";
import { playerAirplane } from "./PlayerAirplane";
import { attemptToFire } from "../../entities/Weapon"
import { enemyWeaponParams } from "../../entities/Weapon/EnemyWeapon"

/** Parameter values of the enemy airplanes. */
export const enemyAirplaneParams: AirplaneParams = {
  angularAcceleration: 100,
  angularDeceleration: 100,
  maxAngularSpeed: .4,
  acceleration: 500,
  maxSpeed: 400,
  deceleration: 250,
  fullHealth: 100,
  damageOnImpact: 50,
}

/** Adds the initial enemy airplanes to the scene. */
export function addInitialEnemyAirplanes() {
  for (let i = 0; i < 10; i++) {
    const enemy = enemyAirplanePool.get();
    /* compute initial position */ {
      enemy.position
        .fromAngle(Math.random() * TAU)
        .multiplyScalar(600);
    }
      /* init sprite */ {
      enemy.sprite = new AnimatedSprite([Texture.from('hawk')]);
      enemy.sprite.anchor.set(0.5, 0.5);
      enemy.sprite.position;
      stage.addChild(enemy.sprite);
    }
    enemy.angularSpeed = 0;
    enemy.rotation = Math.random() * TAU;
    enemy.sprite.position.set(enemy.position.x, enemy.position.y);
    enemy.velocity.set(0, 0);
    enemy.lastBulletTimestamp = 0;
    enemy.health = enemyAirplaneParams.fullHealth;
  }
}

/** Updates the enemy airplanes each frame. */
export function updateEnemyAirplanes(dt: number) {
  enemyAirplanePool.startIteration()
  let enemy: Airplane | null;
  while (enemy = enemyAirplanePool.next()) {
    /* compute rotation sign */
    let rotationSign: number; {
      const currentDirection = vectorPool
        .fromAngle(enemy.rotation);
      const directionTowardsPlayer = vectorPool
        .copy(enemy.position)
        .directionTo(playerAirplane.position);
      rotationSign = currentDirection.angleTo(directionTowardsPlayer);
      if (Math.abs(rotationSign) < PI / 20) rotationSign = 0;
    }
    /* update position */ {
      updateAirplane(enemy, enemyAirplaneParams, rotationSign, dt);
    }
    /* attempt to fire */ {
      if (
        enemy.position.distance(playerAirplane.position) < enemyWeaponParams.maxShootingDistance
      ) {
        attemptToFire(enemy, true);
      }
    }
  }
}

/** Pool to manage the memory of the enemy entities. */
export const enemyAirplanePool = new EntityPool<Airplane>(() => new Airplane());
