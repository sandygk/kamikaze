import { Sprite, Texture } from "pixi.js";
import { stage } from "../../main";
import { EntityPool } from "../../utils/EntityPool";
import { Vector2D, vectorPool } from "../../utils/Vector";
import { Airplane } from "../Airplane";
import { enemyAirplanePool } from "../Airplane/EnemyAirplane";
import { playerAirplane } from "../Airplane/PlayerAirplane";
import { Spark } from "../Spark";
import { enemyBulletsParams } from "./EnemyBullet";
import { playerBulletsParams } from "./PlayerBullet";

/** Parameters of a bullet. */
export type BulletParams = {
  /** The speed at which the bullet moves. */
  speed: number,
  /** Amount of damage bullet cause on impact. */
  damageOnImpact: number,
  /** Name of the bullet sprite. */
  spriteName: string,
  /** Is this an enemy or a player bullet. */
  isEnemyBullet: boolean,
}

/** Bullet entity. */
export class Bullet {
  /** Life span in milliseconds of a bullet. */
  static readonly lifeSpan = 4000;

  /** Direction in which the bullet is moving. */
  direction = 0;
  /** Position of the bullet. */
  position = new Vector2D();
  /** Sprite used to render the bullet. */
  sprite: Sprite = new Sprite();
  /** Amount of damage the bullet causes on impact. */
  damageOnImpact = 0;
  /** Params for the given type of bullet. */
  params: BulletParams = enemyBulletsParams;
  /** Timestamp when the bullet was spawned. */
  creationTimestamp = 0;

  /** The radius of a bullet*/
  static radius = 10;

  /** Initializes an instance of the Bullet class*/
  constructor() {
    this.sprite.anchor.set(0.5, 0.5);
  }
}

/**
Spawns a bullet in the scene based on the given arguments.
@param position The position where the bullet should be spawned.
@param direction The direction of the bullet.
@param isEnemyBullet Whether the bullet is an enemy's or a player's bullet.
*/
export function spawnBullet(position: Vector2D, direction: number, isEnemyBullet: boolean) {
  const bulletParams = isEnemyBullet ? enemyBulletsParams : playerBulletsParams;
  const bullet = bulletPool.get();

  bullet.direction = direction;
  bullet.position.copy(position);
  bullet.sprite.texture = Texture.from(bulletParams.spriteName);
  bullet.params = bulletParams;
  bullet.creationTimestamp = Date.now();

  stage.addChild(bullet.sprite);
}

export function removeBullet(bullet: Bullet) {
  bulletPool.freeCurrent();
  stage.removeChild(bullet.sprite);
}

/** Updates the bullets each frame. */
export function updateBullets(dt: number) {
  bulletPool.startIteration();
  let bullet: Bullet | null;
  while (bullet = bulletPool.next()) {
    /* update position */ {
      const bulletParams = bullet.params;
      const displacement = vectorPool
        .fromAngle(bullet.direction)
        .multiplyScalar(dt * bulletParams.speed);
      bullet.position.add(displacement);
    }

    /* update sprite */ {
      bullet.sprite.rotation = bullet.direction;
      bullet.sprite.position.set(bullet.position.x, bullet.position.y);
    }
    /* remove expired bullets */ {
      if (Date.now() - bullet.creationTimestamp > Bullet.lifeSpan) {
        removeBullet(bullet);
        continue; // the bullet got removed
      }
    }
    /* check collision */ {
      if (bullet.params.isEnemyBullet &&
        bulletAirplaneCollision(bullet, playerAirplane)) {
        continue; // the bullet got removed
      }
      else if (!bullet.params.isEnemyBullet) {
        let collisionFound = false;
        enemyAirplanePool.startIteration()
        let enemyAirplane: Airplane | null;
        while (enemyAirplane = enemyAirplanePool.next()) {
          if(bulletAirplaneCollision(bullet, enemyAirplane)) {
            collisionFound = true;
            break;
          }
        }
        if (collisionFound)
          continue; // the bullet got removed
      }
    }
  }
}

export function bulletAirplaneCollision(bullet: Bullet, airplane: Airplane) {
  if (bullet.position.distance(airplane.position) < 10) {
    Spark.spawn(bullet.position);
    removeBullet(bullet);
    return true;
  }
  return false;
}

/** Pool to manage the memory of the bullet entities. */
export const bulletPool = new EntityPool<Bullet>(() => new Bullet());
