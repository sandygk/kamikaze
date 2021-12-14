import { Spark } from "../Spark";
import { Bullet } from "../Bullet";
import { Airplane } from "../Airplane";
import { vectorPool } from "../utils/Vector";
import { PI } from "../utils/math";

/** Parameters of a weapon. */
export type WeaponParams = {
  /** Time to wait between shots. */
  fireCooldownTime: number,
  /** Bullets direction is randomized within the spread angle. */
  spreadAngle: number,
}

export class Weapon {
  /** Weapon parameters for the player. */
  static PlayerParams: WeaponParams = {
    fireCooldownTime: 150,
    spreadAngle: PI / 20,
  }
  /** Weapon parameters for the enemies. */
  static EnemyParams: WeaponParams = {
    spreadAngle: PI / 10,
    fireCooldownTime: 4000,
  }
  /** Airplane that has the weapon. */
  airplane?: Airplane;
  /** Weapon params. */
  params?: WeaponParams;

  /**
  Creates a new instance of the Weapon class
  @param airplane The airplane that has the weapon.
  */
  constructor(airplane: Airplane) {
    this.airplane = airplane;
    this.params = airplane.params!.isEnemyAirplane? Weapon.EnemyParams : Weapon.PlayerParams;
  }

  /**
  Attempts to fire a bullet from the given airplane. The bullet
  will be fired unless the cooldown time hasn't been completed yet.
  @param airplane The airplane that shots the bullet
  @param isEnemyAirplane Whether the airplane is an enemy airplane or not
  */
  attemptToFire() {
    if (Date.now() - this.airplane!.lastBulletTimestamp > this.params!.fireCooldownTime) {
      this.airplane!.lastBulletTimestamp = Date.now();
      const direction =
        this.airplane!.rotation
        + Math.random() * this.params!.spreadAngle
        - this.params!.spreadAngle / 2;
      const position = vectorPool
        .copy(this.airplane!.position)
        .add(
          vectorPool
            .fromAngle(direction)
            .multiplyScalar(30)
        );
      Bullet.spawn(position, direction, this.airplane!.params.isEnemyAirplane);
      Spark.spawn(position);
    }
  }
}


