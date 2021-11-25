import { stage } from "../main";
import { Vector2D, vectorPool } from "../utils/Vector";
import { enemyAirplanePool } from "../entities/Airplane/EnemyAirplane";
import { playerAirplane } from "../entities/Airplane/PlayerAirplane";

/** Parameter values of the camera. */
export const cameraParams = {
  /**
  How far ahead in time (seconds) the camera will project the
  playerAirplane to find its target. The camera computes where
  the the playerAirplane will be after the time ahead passes
  based on the current playerAirplane velocity and looks
  at that position to give the playerAirplane a better view
  of what's coming.
  */
  timeAhead: 1 / 7,
  /** Maximum distance the camera's target can be from the playerAirplane*/
  maxDistanceFromPlayer: 80,
}

/** Stores the information of the camera. */
export const camera = {
  /** Current position of the camera.*/
  position: new Vector2D(),
};

/** Updates the camera each frame. */
export function updateCamera() {
  // average the enemies positions
  enemyAirplanePool.startIteration();
  let enemiesInRangeCount = 0;
  let enemy;
  const enemiesInRangeAvgPosition = vectorPool.new();
  while (enemy = enemyAirplanePool.next()) {
    enemiesInRangeAvgPosition.add(enemy.position)
    enemiesInRangeCount++;
  }
  enemiesInRangeAvgPosition.divideScalar(enemiesInRangeCount);

  // average the average enemy position with the playerAirplane's position in time ahead seconds
  const targetPosition = vectorPool
    .copy(playerAirplane.velocity)
    .multiplyScalar(cameraParams.timeAhead)
    .add(playerAirplane.position)
  if (enemiesInRangeCount > 0)
    targetPosition
      .add(enemiesInRangeAvgPosition)
      .divideScalar(2);
  camera.position.copy(playerAirplane.position)
    .moveToward(targetPosition, cameraParams.maxDistanceFromPlayer);
  camera.position.toObservablePoint(stage.pivot);
}
