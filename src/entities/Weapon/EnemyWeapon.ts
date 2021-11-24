import { WeaponParams } from ".";
import { PI } from "../../utils/math";

/** Parameters of the enemy weapon. */
export type EnemyWeaponParams = WeaponParams & {
  /** Maximum distance from the player for the enemy to start shooting */
  maxShootingDistance: number,
}

/** Parameters of the enemy weapon. */
export const enemyWeaponParams: EnemyWeaponParams = {
  spreadAngle: PI / 10,
  fireCooldownTime: 4000,
  maxShootingDistance: 300,
}
