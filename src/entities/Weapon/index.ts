import { bulletPool } from "../../entities/Bullet";
import { stage } from "../../main";
import { Sprite, Texture } from "pixi.js";
import { Vector2D } from "../../utils/Vector";
import { Airplane } from "../Airplane";
import { enemyBulletsParams } from "../Bullet/EnemyBullet";
import { playerBulletsParams } from "../Bullet/PlayerBullet";
import { enemyWeaponParams } from "./EnemyWeapon";
import { playerWeaponParams } from "./PlayerWeapon";


/** Parameters of a weapon. */
export type WeaponParams = {
  /** Time to wait between shots. */
  fireCooldownTime: number,
  /** Bullets direction is randomized within the spread angle. */
  spreadAngle: number,
}

/**
Attempts to fire a bullet from the given airplane. The bullet
will be fired unless the cooldown time hasn't been completed yet.
@param airplane The airplane that shots the bullet
@param isEnemyAirplane Whether the airplane is an enemy airplane or not
*/
export function attemptToFire(airplane: Airplane, isEnemyAirplane: boolean) {
  const bulletParams = isEnemyAirplane ? enemyBulletsParams : playerBulletsParams;
  const weaponParams = isEnemyAirplane ? enemyWeaponParams : playerWeaponParams;
  const spriteName = isEnemyAirplane ? 'round-fire-with-border' : 'round-fire-no-border';
  if (Date.now() - airplane.lastBulletTimestamp > weaponParams.fireCooldownTime) {
    airplane.lastBulletTimestamp = Date.now();
    /* create bullet */ {
      const bullet = bulletPool.get();
      let sprite: Sprite
      /* init sprite */ {
        sprite = new Sprite(Texture.from(spriteName));
        sprite.anchor.set(0.5, 0.5);
        stage.addChild(sprite);
      }
      /* init bullet */ {
        bullet.direction = airplane.rotation
          + Math.random() * weaponParams.spreadAngle
          - weaponParams.spreadAngle / 2;
        bullet.position = new Vector2D().copy(airplane.position);
        bullet.sprite = sprite;
        bullet.damageOnImpact = bulletParams.damageOnImpact;
        bullet.isEnemyBullet = isEnemyAirplane;
      }
    }
  }
}
