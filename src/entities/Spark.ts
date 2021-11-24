import { Vector2D } from "../utils/Vector";
import { EntityPool } from "../utils/EntityPool"

/** Spark entity. Sparks are spawned when the bullet are fired and when they hit a target. */
export class Spark {
  /**Position of the spark. */
  position = new Vector2D();
  /**Timestamp of the moment when the spark was created. */
  creationTimestamp = 0;
}


/** Parameters for the sparks. */
export const sparkParams = {
  /** Lifetime of a spark in seconds. */
  lifetime: 1,
}


/** Pool to manage the memory of the spark entities. */
export const sparkPool = new EntityPool<Spark>(() => new Spark());
