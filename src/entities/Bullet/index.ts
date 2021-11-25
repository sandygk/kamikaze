import { Sprite } from "pixi.js";
import { EntityPool } from "../../utils/EntityPool";
import { Vector2D, vectorPool } from "../../utils/Vector";
import { enemyBulletsParams } from "./EnemyBullet";
import { playerBulletsParams } from "./PlayerBullet";

/** Parameters of a bullet. */
export type BulletParams = {
  /** The speed at which the bullet moves. */
  speed: number,
  /** Amount of damage bullet cause on impact*/
  damageOnImpact: number,
}

/** Bullet entity. */
export class Bullet {
  /** Direction in which the bullet is moving. */
  direction = 0;
  /** Position of the bullet. */
  position = new Vector2D();
  /** Sprite used to render the bullet. */
  sprite?: Sprite;
  /** Amount of damage the bullet causes on impact. */
  damageOnImpact = 0;
  /** Whether the bullet was shot by an enemy or the player*/
  isEnemyBullet = false;
}

/** Updates the bullets each frame. */
export function updateBullets(dt: number) {
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

/** Pool to manage the memory of the bullet entities. */
export const bulletPool = new EntityPool<Bullet>(() => new Bullet());
