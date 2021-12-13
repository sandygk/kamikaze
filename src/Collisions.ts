import { Bullet } from "./entities/Bullet";
import { Airplane } from "./entities/Airplane";
import { Spark } from "./entities/Spark";

/** Class to check for and handle the different collisions between entities. */
export class Collisions {
  /**
  Checks for and handles the collision between a bullet and an airplane.
  @param bullet The bullet to check for collision against `airplane`.
  @param airplane The airplane to check for collision against `bullet`.
  @returns A boolean indicating whether there is a collision or not
  */
  static bulletAirplane(bullet: Bullet, airplane: Airplane) {
    if (bullet.position.distance(airplane.position) < 10) {
      Spark.spawn(bullet.position);
      bullet.free();
      airplane.receiveDamage(bullet.damage);
      return true;
    }
    return false;
  }
}
