import { Spark } from "../Spark";
import { spawnBullet } from "../../entities/Bullet";
import { Airplane } from "../Airplane";
import { enemyWeaponParams } from "./EnemyWeapon";
import { playerWeaponParams } from "./PlayerWeapon";
import { vectorPool } from "../../utils/Vector";


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
  const weaponParams = isEnemyAirplane ? enemyWeaponParams : playerWeaponParams;
  if (Date.now() - airplane.lastBulletTimestamp > weaponParams.fireCooldownTime) {
    airplane.lastBulletTimestamp = Date.now();
    const direction =
      airplane.rotation
      + Math.random() * weaponParams.spreadAngle
      - weaponParams.spreadAngle / 2;
    const position = vectorPool
      .copy(airplane.position)
      .add(
        vectorPool
          .fromAngle(direction)
          .multiplyScalar(30)
      );
    spawnBullet(position, direction, isEnemyAirplane);
    Spark.spawn(position);
  }
}
