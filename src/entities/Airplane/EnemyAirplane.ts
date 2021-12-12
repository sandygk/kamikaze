import { Airplane, AirplaneParams } from "./index"
import { EntityPool } from "../../utils/EntityPool"
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Texture } from "@pixi/core";
import { Game } from "../../Game";
import { PI, TAU } from "../../utils/math";
import { vectorPool } from "../../utils/Vector";
import { playerAirplane } from "./PlayerAirplane";
import { Weapon } from "../Weapon";


/** Parameters of the enemy airplanes. */
export type EnemyAirplaneParams = AirplaneParams & {
  /** Maximum distance from the player for the enemy to start shooting */
  maxShootingDistance: number,
}

/** Handle the logic for the enemy airplanes. */
export class EnemyAirplane extends Airplane {
  /** Pool to manage the memory of the enemy entities. */
  static pool = new EntityPool<EnemyAirplane>(() => new EnemyAirplane());
  /** Parameters for the enemy airplanes */
  static params: EnemyAirplaneParams = {
    angularAcceleration: 100,
    angularDeceleration: 100,
    maxAngularSpeed: .4,
    acceleration: 500,
    maxSpeed: 400,
    deceleration: 250,
    fullHealth: 100,
    damageOnImpact: 50,
    isEnemyAirplane: true,
    maxShootingDistance: 300,
  };
  /** Parameters for the enemy airplanes */
  params = EnemyAirplane.params;

  /** Adds the initial enemy airplanes to the scene. */
  static spawnAll() {
    for (let i = 0; i < 10; i++) {
      const enemy = EnemyAirplane.pool.get();
      /* compute initial position */ {
        enemy.position
          .fromAngle(Math.random() * TAU)
          .multiplyScalar(600);
      }
        /* init sprite */ {
        enemy.sprite = new AnimatedSprite([Texture.from('hawk')]);
        enemy.sprite.anchor.set(0.5, 0.5);
        enemy.sprite.position;
        Game.stage.addChild(enemy.sprite);
      }
      enemy.angularSpeed = 0;
      enemy.rotation = Math.random() * TAU;
      enemy.sprite.position.set(enemy.position.x, enemy.position.y);
      enemy.velocity.set(0, 0);
      enemy.lastBulletTimestamp = 0;
      enemy.health = EnemyAirplane.params.fullHealth;
      enemy.weapon = new Weapon(enemy);
    }
  }

  /** Updates the enemy airplanes each frame. */
  static updateAll() {
    EnemyAirplane.pool.startIteration()
    let enemy: EnemyAirplane | null;
    while (enemy = EnemyAirplane.pool.next()) {
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
        enemy.move(rotationSign);
      }
      /* attempt to fire */ {
        if (
          enemy.position.distance(playerAirplane.position) < enemy.params!.maxShootingDistance
        ) {
          enemy.weapon!.attemptToFire();
        }
      }
    }
  }
}







