import { Vector2D } from "./utils/Vector";
import { EntityPool } from "./utils/EntityPool"
import { Sprite } from "@pixi/sprite";
import { Texture } from "@pixi/core";
import { Game } from "./Game";

/** Sparks are spawned when the bullet are fired and when they hit a target. */
export class Spark {
  /** Life span of a spark in milliseconds. */
  static readonly lifeSpan = 80;
  /** Pool to manage the memory of the spark entities. */
  static readonly pool = new EntityPool<Spark>(() => new Spark());

  /** Position of the spark. */
  position = new Vector2D();
  /** Position of the spark. */
  velocity = new Vector2D();
  /** Timestamp of the moment when the spark was created. */
  spawnTimestamp = 0;
  /** Sprite for the spark.*/
  sprite = new Sprite(Texture.from('spark'));

  /** Creates a new instance of the Spark class. */
  constructor() {
    this.sprite.anchor.set(0.5, 0.5);
  }

  /** Initializes the spark. */
  static spawn(position: Vector2D) {
    const spark = Spark.pool.get();

    spark.position.copy(position);
    spark.spawnTimestamp = Date.now();

    spark.sprite.position.set(spark.position.x, spark.position.y);
    Game.stage.addChild(spark.sprite);
  }

  /** Updates all the sparks in the scene. */
  static updateAll() {
    Spark.pool.startIteration();
    let spark: Spark | null;
    while (spark = Spark.pool.next()) {
      /* remove expired sparks */ {
        if (Date.now() - spark.spawnTimestamp > Spark.lifeSpan) {
          Spark.pool.freeCurrent();
          Game.stage.removeChild(spark.sprite);
          continue;
        }
      }
    }
  }
}

