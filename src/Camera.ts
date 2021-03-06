import { Game } from "./Game";
import { Vector2D, vectorPool } from "./utils/Vector";
import { playerAirplane } from "./PlayerAirplane";
import { EnemyAirplane } from "./EnemyAirplane";

/** Handles the Camera logic*/
export class Camera {
  /**
  How far ahead in time (seconds) the camera will project the
  playerAirplane to find its target. The camera computes where
  the the playerAirplane will be after the time ahead passes
  based on the current playerAirplane velocity and looks
  at that position to give the playerAirplane a better view
  of what's coming.
  */
  static timeAhead = 1 / 6;
  /** Maximum distance the camera's target can be from the playerAirplane*/
  static maxDistanceFromPlayer = 80;

  /** Current position of the camera.*/
  static position = new Vector2D();

  /** Updates the camera each frame. */
  static update() {
    // average the enemies positions
    EnemyAirplane.pool.startIteration();
    let enemiesInRangeCount = 0;
    let enemy;
    const enemiesInRangeAvgPosition = vectorPool.new();
    while (enemy = EnemyAirplane.pool.next()) {
      enemiesInRangeAvgPosition.add(enemy.position)
      enemiesInRangeCount++;
    }
    enemiesInRangeAvgPosition.divideScalar(enemiesInRangeCount);

    // average the average enemy position with the playerAirplane's position in time ahead seconds
    const targetPosition = vectorPool
      .copy(playerAirplane.velocity)
      .multiplyScalar(Camera.timeAhead)
      .add(playerAirplane.position)
    if (enemiesInRangeCount > 0)
      targetPosition
        .add(enemiesInRangeAvgPosition)
        .divideScalar(2);
    const lerpedTargetPosition = vectorPool.copy(Camera.position).lerp(targetPosition, .2 * Game.dt * 60);

    const clampedTargetPosition = vectorPool.copy(playerAirplane.position)
      .moveToward(lerpedTargetPosition, Camera.maxDistanceFromPlayer);

    Camera.position.copy(clampedTargetPosition);
    Camera.position.toObservablePoint(Game.stage.pivot);
  }
}




